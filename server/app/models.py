import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class SwipeDirection(str, enum.Enum):
    SWAP = "SWAP"
    SKIP = "SKIP"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: f"usr_{uuid.uuid4().hex[:12]}")
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, default=lambda: f"prf_{uuid.uuid4().hex[:12]}")
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    full_name = Column(String, nullable=False)
    handle = Column(String, unique=True, nullable=False, index=True)
    headline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    is_phone_verified = Column(Boolean, default=False)
    phone_number = Column(String, nullable=True)
    streak_days = Column(Integer, default=0)
    total_swaps = Column(Integer, default=0)
    remaining_swipes = Column(Integer, default=10)
    last_streak_date = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)

    user = relationship("User", back_populates="profile")
    skills = relationship("UserSkill", back_populates="profile", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String, primary_key=True, default=lambda: f"skl_{uuid.uuid4().hex[:12]}")
    name = Column(String, unique=True, nullable=False, index=True)

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String, primary_key=True, default=lambda: f"usk_{uuid.uuid4().hex[:12]}")
    profile_id = Column(String, ForeignKey("profiles.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # 'OFFERED' or 'WANTED'

    profile = relationship("Profile", back_populates="skills")

class Swipe(Base):
    __tablename__ = "swipes"

    id = Column(String, primary_key=True, default=lambda: f"swp_{uuid.uuid4().hex[:12]}")
    from_user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    to_user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String, nullable=False)  # 'SWAP' or 'SKIP'
    created_at = Column(DateTime, default=datetime.utcnow)

class Match(Base):
    __tablename__ = "matches"

    id = Column(String, primary_key=True, default=lambda: f"mtc_{uuid.uuid4().hex[:12]}")
    user_a_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    user_b_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: f"msg_{uuid.uuid4().hex[:12]}")
    match_id = Column(String, ForeignKey("matches.id"), nullable=False, index=True)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class StreakPost(Base):
    __tablename__ = "streak_posts"

    id = Column(String, primary_key=True, default=lambda: f"pst_{uuid.uuid4().hex[:12]}")
    author_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    skill_tag = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
