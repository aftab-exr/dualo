from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from app.database import get_db
from app.models import User, Profile, UserSkill, Swipe, Match
from app.schemas import FeedUserResponse, SwipeRequest, SwipeResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/feed", tags=["Discovery Feed"])

@router.get("", response_model=List[FeedUserResponse])
async def get_feed(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. Fetch IDs of users already swiped by current user
    swiped_result = await db.execute(
        select(Swipe.to_user_id).filter(Swipe.from_user_id == current_user.id)
    )
    swiped_user_ids = set(swiped_result.scalars().all())
    swiped_user_ids.add(current_user.id)  # Exclude self

    # 2. Query target candidates not yet swiped
    result = await db.execute(
        select(User)
        .options(selectinload(User.profile).selectinload(Profile.skills))
        .filter(User.id.notin_(swiped_user_ids))
        .limit(20)
    )
    candidates = result.scalars().all()

    # 3. Format response
    feed = []
    for user in candidates:
        profile = user.profile
        if not profile:
            continue
        offered = [s.skill_name for s in profile.skills if s.type == "OFFERED"]
        wanted = [s.skill_name for s in profile.skills if s.type == "WANTED"]
        
        feed.append(
            FeedUserResponse(
                id=user.id,
                fullName=profile.full_name,
                handle=profile.handle,
                headline=profile.headline,
                bio=profile.bio,
                location=profile.location,
                skillsOffered=offered,
                skillsWanted=wanted
            )
        )
    return feed

@router.post("/swipe", response_model=SwipeResponse)
async def process_swipe(
    body: SwipeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile = current_user.profile

    # 1. Enforce swipe quota
    if profile.remaining_swipes <= 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Daily swipe quota exhausted. Earn more swipes by logging a learning streak!"
        )

    # 2. Prevent self-swipe
    if body.targetUserId == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot swipe on yourself")

    # 3. Prevent duplicate swipe
    existing_swipe = await db.execute(
        select(Swipe).filter(
            Swipe.from_user_id == current_user.id,
            Swipe.to_user_id == body.targetUserId
        )
    )
    if existing_swipe.scalars().first():
        raise HTTPException(status_code=400, detail="Already swiped on this user")

    # 4. Record swipe and decrement quota
    new_swipe = Swipe(
        from_user_id=current_user.id,
        to_user_id=body.targetUserId,
        action=body.action.upper()
    )
    db.add(new_swipe)
    profile.remaining_swipes -= 1
    
    is_match = False
    match_id = None

    # 5. Check reciprocal match if action is SWAP
    if body.action.upper() == "SWAP":
        reciprocal_result = await db.execute(
            select(Swipe).filter(
                Swipe.from_user_id == body.targetUserId,
                Swipe.to_user_id == current_user.id,
                Swipe.action == "SWAP"
            )
        )
        reciprocal_swipe = reciprocal_result.scalars().first()

        if reciprocal_swipe:
            is_match = True
            new_match = Match(
                user_a_id=current_user.id,
                user_b_id=body.targetUserId
            )
            db.add(new_match)
            await db.flush()
            match_id = new_match.id

            # Increment swap counts for both profiles
            profile.total_swaps += 1
            target_user = await db.execute(
                select(User).options(selectinload(User.profile)).filter(User.id == body.targetUserId)
            )
            target = target_user.scalars().first()
            if target and target.profile:
                target.profile.total_swaps += 1

    await db.commit()

    return SwipeResponse(
        isMatch=is_match,
        matchId=match_id,
        remainingSwipes=profile.remaining_swipes
    )