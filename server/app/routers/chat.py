from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Dict, Optional
import json

from app.database import AsyncSessionLocal, get_db
from app.models import User, Profile, Match, Message
from app.schemas import MatchResponse, MessageResponse, FeedUserResponse, SendMessageRequest
from app.dependencies import get_current_user
from app.security import decode_access_token

router = APIRouter(prefix="/api/v1", tags=["Matches & Chat"])

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        # Match ID -> List of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, match_id: str, websocket: WebSocket):
        await websocket.accept()
        if match_id not in self.active_connections:
            self.active_connections[match_id] = []
        self.active_connections[match_id].append(websocket)

    def disconnect(self, match_id: str, websocket: WebSocket):
        if match_id in self.active_connections:
            if websocket in self.active_connections[match_id]:
                self.active_connections[match_id].remove(websocket)
            if not self.active_connections[match_id]:
                del self.active_connections[match_id]

    async def broadcast_to_match(self, match_id: str, message_data: dict):
        if match_id in self.active_connections:
            payload = json.dumps(message_data)
            for connection in self.active_connections[match_id]:
                await connection.send_text(payload)

manager = ConnectionManager()

# ----------------- REST ENDPOINTS -----------------

@router.get("/matches", response_model=List[MatchResponse])
async def get_user_matches(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch matches where current user is participant A or B
    result = await db.execute(
        select(Match)
        .filter((Match.user_a_id == current_user.id) | (Match.user_b_id == current_user.id))
        .order_by(Match.created_at.desc())
    )
    matches = result.scalars().all()

    response = []
    for match in matches:
        other_user_id = match.user_b_id if match.user_a_id == current_user.id else match.user_a_id
        
        # Load matched user details with profile and skills
        user_result = await db.execute(
            select(User)
            .options(selectinload(User.profile).selectinload(Profile.skills))
            .filter(User.id == other_user_id)
        )
        other_user = user_result.scalars().first()
        if not other_user or not other_user.profile:
            continue

        p = other_user.profile
        offered = [s.skill_name for s in p.skills if s.type == "OFFERED"]
        wanted = [s.skill_name for s in p.skills if s.type == "WANTED"]

        matched_user_res = FeedUserResponse(
            id=other_user.id,
            fullName=p.full_name,
            handle=p.handle,
            headline=p.headline,
            bio=p.bio,
            location=p.location,
            skillsOffered=offered,
            skillsWanted=wanted,
            avatarUrl=p.avatar_url
        )

        # Get last message in match
        msg_result = await db.execute(
            select(Message)
            .filter(Message.match_id == match.id)
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        last_msg = msg_result.scalars().first()
        last_msg_res = None
        if last_msg:
            last_msg_res = MessageResponse(
                id=last_msg.id,
                matchId=last_msg.match_id,
                senderId=last_msg.sender_id,
                text=last_msg.text,
                createdAt=last_msg.created_at
            )

        response.append(
            MatchResponse(
                id=match.id,
                matchedUser=matched_user_res,
                createdAt=match.created_at,
                lastMessage=last_msg_res
            )
        )
    return response

@router.get("/matches/{match_id}/messages", response_model=List[MessageResponse])
async def get_match_messages(
    match_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify user belongs to match
    match_result = await db.execute(select(Match).filter(Match.id == match_id))
    match = match_result.scalars().first()
    if not match or (match.user_a_id != current_user.id and match.user_b_id != current_user.id):
        raise HTTPException(status_code=403, detail="Unauthorized access to match history")

    # Fetch chat history
    msg_result = await db.execute(
        select(Message)
        .filter(Message.match_id == match_id)
        .order_by(Message.created_at.asc())
    )
    messages = msg_result.scalars().all()

    return [
        MessageResponse(
            id=m.id,
            matchId=m.match_id,
            senderId=m.sender_id,
            text=m.text,
            createdAt=m.created_at
        )
        for m in messages
    ]

# ----------------- WEBSOCKET ENDPOINT -----------------

@router.websocket("/chat/ws/{match_id}")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    match_id: str,
    token: str = Query(...)
):
    # Authenticate token
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user_id = payload["sub"]

    async with AsyncSessionLocal() as db:
        # Verify match ownership
        match_result = await db.execute(select(Match).filter(Match.id == match_id))
        match = match_result.scalars().first()
        if not match or (match.user_a_id != user_id and match.user_b_id != user_id):
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

    await manager.connect(match_id, websocket)

    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                data = json.loads(data_text)
            except Exception:
                continue

            text_content = data.get("text", "").strip()
            if not text_content:
                continue

            # Save message to database
            async with AsyncSessionLocal() as db:
                new_msg = Message(
                    match_id=match_id,
                    sender_id=user_id,
                    text=text_content
                )
                db.add(new_msg)
                await db.commit()
                await db.refresh(new_msg)

                msg_payload = {
                    "id": new_msg.id,
                    "matchId": new_msg.match_id,
                    "senderId": new_msg.sender_id,
                    "text": new_msg.text,
                    "createdAt": new_msg.created_at.isoformat()
                }

            # Broadcast real-time message to match channel
            await manager.broadcast_to_match(match_id, msg_payload)

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        manager.disconnect(match_id, websocket)