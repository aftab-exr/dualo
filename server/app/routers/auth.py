from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime
from pydantic import BaseModel
from app.database import get_db
from app.models import User, Profile, UserSkill
from app.schemas import UserRegisterRequest, UserLoginRequest, PhoneVerifyRequest, AuthResponse, UserProfileResponse
from app.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user
from app.config import settings
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials as firebase_credentials
import json
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

class GoogleAuthRequest(BaseModel):
    idToken: str

# Initialize Firebase Admin SDK once
if not firebase_admin._apps:
    # Option 1: GOOGLE_APPLICATION_CREDENTIALS env var pointing to a JSON file
    # Option 2: FIREBASE_SERVICE_ACCOUNT_JSON env var with the JSON string
    # Option 3: Just the project ID (sufficient for ID token verification)
    sa_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "")
    if sa_json:
        try:
            sa_dict = json.loads(sa_json)
            cred = firebase_credentials.Certificate(sa_dict)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            logger.warning(f"Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: {e}")
            firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
    elif os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        firebase_admin.initialize_app()
    elif settings.FIREBASE_PROJECT_ID:
        # Minimal init with just project ID — enough for verify_id_token
        firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
    else:
        firebase_admin.initialize_app()

@router.post("/google", response_model=AuthResponse)
async def google_auth(
    body: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db)
):
    id_token = body.idToken
    if not id_token:
        raise HTTPException(status_code=400, detail="ID token required")
    
    # Verify Firebase ID token using Admin SDK with fallback to Google tokeninfo
    decoded_token = None
    try:
        # clock_skew_seconds=10 handles minor clock differences between client/server
        decoded_token = firebase_auth.verify_id_token(id_token, clock_skew_seconds=10)
        logger.info(f"Firebase token verified for user: {decoded_token.get('email', 'unknown')}")
    except firebase_auth.ExpiredIdTokenError as e:
        logger.error(f"Expired Firebase ID token: {e}")
        raise HTTPException(status_code=401, detail=f"Firebase ID token expired: {e}")
    except firebase_auth.RevokedIdTokenError as e:
        logger.error(f"Revoked Firebase ID token: {e}")
        raise HTTPException(status_code=401, detail=f"Firebase ID token revoked: {e}")
    except firebase_auth.InvalidIdTokenError as e:
        logger.error(f"Invalid Firebase ID token: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid Firebase ID token: {e}")
    except Exception as e:
        logger.error(f"Firebase token verification failed: {type(e).__name__}: {e}")
        # Fallback to Google OAuth tokeninfo validation
        try:
            import urllib.request
            import json as json_lib
            req = urllib.request.Request(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
            with urllib.request.urlopen(req, timeout=5) as resp:
                if resp.status == 200:
                    data = json_lib.loads(resp.read().decode())
                    if "email" in data:
                        decoded_token = data
                        logger.info(f"Google tokeninfo fallback verified for: {data.get('email')}")
        except Exception as fallback_e:
            logger.error(f"Google tokeninfo fallback failed: {fallback_e}")

    if not decoded_token:
        raise HTTPException(status_code=401, detail="Invalid Firebase ID token - verification failed")
    
    email = decoded_token.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email not found in token")
    
    full_name = decoded_token.get("name", "")
    picture = decoded_token.get("picture", "")
    
    # Check if user exists
    result = await db.execute(
        select(User)
        .options(selectinload(User.profile).selectinload(Profile.skills))
        .filter(User.email == email)
    )
    user = result.scalars().first()
    
    if not user:
        # Create new user
        new_user = User(email=email)
        db.add(new_user)
        await db.flush()
        
        # Generate unique handle
        base_handle = email.split("@")[0].replace(".", "_")
        handle = base_handle
        counter = 1
        while True:
            existing = await db.execute(select(Profile).filter(Profile.handle == handle))
            if not existing.scalars().first():
                break
            handle = f"{base_handle}{counter}"
            counter += 1
        
        new_profile = Profile(
            user_id=new_user.id,
            full_name=full_name,
            handle=handle,
            bio=f"Google user since {datetime.utcnow().strftime('%Y')}",
            avatar_url=picture,
        )
        db.add(new_profile)
        await db.commit()
        
        result = await db.execute(
            select(User)
            .options(selectinload(User.profile).selectinload(Profile.skills))
            .filter(User.id == new_user.id)
        )
        user = result.scalars().first()
    
    token = create_access_token(user.id)
    return AuthResponse(token=token, user=build_profile_response(user))


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
        skillsWanted=wanted,
        avatarUrl=profile.avatar_url
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