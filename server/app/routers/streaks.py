from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.database import get_db
from app.models import User, Profile, StreakPost
from app.schemas import StreakPostCreateRequest, StreakPostResponse, StreakAuthorResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/streaks", tags=["Learning Streaks"])

@router.post("", response_model=StreakPostResponse, status_code=status.HTTP_201_CREATED)
async def create_streak_post(
    body: StreakPostCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile = current_user.profile
    today_str = date.today().isoformat()

    # Create Streak Post
    new_post = StreakPost(
        author_id=current_user.id,
        title=body.title,
        content=body.content,
        skill_tag=body.skillTag
    )
    db.add(new_post)

    # Streak logic: Reward user with +5 swipes if this is their first streak today
    if profile.last_streak_date != today_str:
        profile.streak_days += 1
        profile.remaining_swipes += 5  # Bonus swipes earned
        profile.last_streak_date = today_str

    await db.commit()
    await db.refresh(new_post)

    return StreakPostResponse(
        id=new_post.id,
        title=new_post.title,
        content=new_post.content,
        skillTag=new_post.skill_tag,
        createdAt=new_post.created_at,
        author=StreakAuthorResponse(
            id=current_user.id,
            fullName=profile.full_name,
            handle=profile.handle
        )
    )

@router.get("", response_model=List[StreakPostResponse])
async def get_community_streaks(
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(StreakPost)
        .order_by(StreakPost.created_at.desc())
        .limit(limit)
    )
    posts = result.scalars().all()

    response = []
    for post in posts:
        # Fetch author profile
        author_res = await db.execute(
            select(User)
            .options(selectinload(User.profile))
            .filter(User.id == post.author_id)
        )
        author = author_res.scalars().first()
        if not author or not author.profile:
            continue

        response.append(
            StreakPostResponse(
                id=post.id,
                title=post.title,
                content=post.content,
                skillTag=post.skill_tag,
                createdAt=post.created_at,
                author=StreakAuthorResponse(
                    id=author.id,
                    fullName=author.profile.full_name,
                    handle=author.profile.handle
                )
            )
        )
    return response