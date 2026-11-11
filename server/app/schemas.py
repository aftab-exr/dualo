from __future__ import annotations
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class MessageResponse(BaseModel):
    id: str
    matchId: str
    senderId: str
    text: str
    createdAt: datetime

class FeedUserResponse(BaseModel):
    id: str
    fullName: str
    handle: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skillsOffered: List[str] = []
    skillsWanted: List[str] = []
    avatarUrl: Optional[str] = None

class MatchResponse(BaseModel):
    id: str
    matchedUser: FeedUserResponse
    createdAt: datetime
    lastMessage: Optional[MessageResponse] = None

class SendMessageRequest(BaseModel):
    text: str

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    fullName: str
    handle: str
    skillsOffered: List[str] = []
    skillsWanted: List[str] = []

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class PhoneVerifyRequest(BaseModel):
    phoneNumber: str
    otpCode: str

class UserProfileResponse(BaseModel):
    id: str
    email: str
    fullName: str
    handle: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    isPhoneVerified: bool
    phoneNumber: Optional[str] = None
    streakDays: int
    totalSwaps: int
    remainingSwipes: int
    skillsOffered: List[str] = []
    skillsWanted: List[str] = []
    avatarUrl: Optional[str] = None

class AuthResponse(BaseModel):
    token: str
    user: UserProfileResponse   

class SwipeRequest(BaseModel):
    targetUserId: str
    action: str  # "SWAP" or "SKIP"

class SwipeResponse(BaseModel):
    isMatch: bool
    matchId: Optional[str] = None
    remainingSwipes: int

class StreakPostCreateRequest(BaseModel):
    title: str
    content: str
    skillTag: str

class StreakAuthorResponse(BaseModel):
    id: str
    fullName: str
    handle: str

class StreakPostResponse(BaseModel):
    id: str
    title: str
    content: str
    skillTag: str
    createdAt: datetime
    author: StreakAuthorResponse
