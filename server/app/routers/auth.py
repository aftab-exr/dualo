from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import User, Profile, UserSkill
from app.schemas import UserRegisterRequest, UserLoginRequest, PhoneVerifyRequest, AuthResponse, UserProfileResponse
from app.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

def build_profile_response(user: User) -> UserProfileResponse:
    profile = user.profile
    offered = [s.skill_name for s in profile.skills if s.type == "OFFERED"]
    wanted = [s.skill_name for s in profile.skills if s.type == "WANTED"]
    
    return UserProfileResponse(
        id=user.id,
        email=user.email,
        fullName=profile.full_name,
        handle=profile.handle,
        headline=profile.headline,
        bio=profile.bio,
        location=profile.location,
        isPhoneVerified=profile.is_phone_verified,
        phoneNumber=profile.phone_number,
        streakDays=profile.streak_days,
        totalSwaps=profile.total_swaps,
        remainingSwipes=profile.remaining_swipes,
        skillsOffered=offered,
        skillsWanted=wanted
    )

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(body: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if email or handle exists
    existing_user = await db.execute(select(User).filter(User.email == body.email))
    if existing_user.scalars().first():
        raise HTTPException(status_code=400, detail="Email is already registered")

    existing_handle = await db.execute(select(Profile).filter(Profile.handle == body.handle))
    if existing_handle.scalars().first():
        raise HTTPException(status_code=400, detail="Handle is already taken")

    # Create User
    new_user = User(
        email=body.email,
        password_hash=hash_password(body.password)
    )
    db.add(new_user)
    await db.flush()

    # Create Profile
    new_profile = Profile(
        user_id=new_user.id,
        full_name=body.fullName,
        handle=body.handle
    )
    db.add(new_profile)
    await db.flush()

    # Add Skills
    for skill_name in body.skillsOffered:
        db.add(UserSkill(profile_id=new_profile.id, skill_name=skill_name, type="OFFERED"))
    for skill_name in body.skillsWanted:
        db.add(UserSkill(profile_id=new_profile.id, skill_name=skill_name, type="WANTED"))

    await db.commit()
    
    # Reload User with relationships
    result = await db.execute(
        select(User)
        .options(selectinload(User.profile).selectinload(Profile.skills))
        .filter(User.id == new_user.id)
    )
    user = result.scalars().first()
    
    token = create_access_token(user.id)
    return AuthResponse(token=token, user=build_profile_response(user))

@router.post("/login", response_model=AuthResponse)
async def login(body: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User)
        .options(selectinload(User.profile).selectinload(Profile.skills))
        .filter(User.email == body.email)
    )
    user = result.scalars().first()
    
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id)
    return AuthResponse(token=token, user=build_profile_response(user))

@router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return build_profile_response(current_user)

@router.post("/verify-phone", response_model=UserProfileResponse)
async def verify_phone(
    body: PhoneVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Mock OTP verification: Accepts "123456" or any non-empty code for dev
    if not body.otpCode:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    profile = current_user.profile
    profile.is_phone_verified = True
    profile.phone_number = body.phoneNumber
    
    await db.commit()
    await db.refresh(profile)
    
    return build_profile_response(current_user)