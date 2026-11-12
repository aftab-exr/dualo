#!/usr/bin/env python3
"""Seed script to populate database with realistic skill-barter users."""
import asyncio
import os
import sys
import uuid
from datetime import datetime

# Add server to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.config import settings
from app.models import User, Profile, UserSkill, Skill
from app.security import hash_password

# Use settings.DATABASE_URL which handles asyncpg and statement_cache_size
engine = create_async_engine(
    settings.database_url_asyncpg,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=300,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Realistic skill-barter users
SEED_USERS = [
    {
        "email": "alex.chen@example.com",
        "password": "password123",
        "full_name": "Alex Chen",
        "handle": "alex_chen",
        "headline": "Full-stack dev teaching React & Node",
        "bio": "Building scalable web apps for 5+ years. Love clean code and good coffee.",
        "location": "San Francisco, CA",
        "skills_offered": ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
        "skills_wanted": ["Python", "Machine Learning", "Rust", "GraphQL"],
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
    {
        "email": "sarah.miller@example.com",
        "password": "password123",
        "full_name": "Sarah Miller",
        "handle": "sarah_designs",
        "headline": "UX/UI Designer helping devs build beautiful products",
        "bio": "Design systems, user research, and prototyping. Former Figma champion.",
        "location": "New York, NY",
        "skills_offered": ["Figma", "UI Design", "Design Systems", "User Research", "Prototyping"],
        "skills_wanted": ["React", "Frontend Architecture", "CSS Animations", "Accessibility"],
        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    },
    {
        "email": "marcus.johnson@example.com",
        "password": "password123",
        "full_name": "Marcus Johnson",
        "handle": "marcus_data",
        "headline": "Data scientist teaching Python & ML",
        "bio": "Turning messy data into insights. Kaggle competitor. Love teaching ML fundamentals.",
        "location": "Austin, TX",
        "skills_offered": ["Python", "Machine Learning", "Pandas", "TensorFlow", "SQL"],
        "skills_wanted": ["React Native", "Mobile Development", "Swift", "Product Management"],
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    },
    {
        "email": "priya.sharma@example.com",
        "password": "password123",
        "full_name": "Priya Sharma",
        "handle": "priya_codes",
        "headline": "Mobile dev teaching React Native & iOS",
        "bio": "Building cross-platform apps. Ex-FAANG. Passionate about performance optimization.",
        "location": "Seattle, WA",
        "skills_offered": ["React Native", "iOS Development", "Swift", "Firebase", "TypeScript"],
        "skills_wanted": ["Backend Architecture", "Go", "Kubernetes", "System Design"],
        "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80",
    },
    {
        "email": "james.wilson@example.com",
        "password": "password123",
        "full_name": "James Wilson",
        "handle": "james_fullstack",
        "headline": "Full-stack engineer teaching Go & Cloud",
        "bio": "Distributed systems, microservices, and cloud infrastructure. AWS certified.",
        "location": "Denver, CO",
        "skills_offered": ["Go", "Kubernetes", "AWS", "Microservices", "GraphQL"],
        "skills_wanted": ["React", "Vue.js", "UI/UX Design", "Product Strategy"],
        "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    },
]

async def seed_users():
    async with AsyncSessionLocal() as db:
        # Check existing user count
        result = await db.execute(select(User))
        existing_users = result.scalars().all()
        
        if len(existing_users) >= 2:
            print(f"Database already has {len(existing_users)} users. Skipping seed.")
            return
        
        print(f"Database has {len(existing_users)} users. Seeding {len(SEED_USERS)} new users...")
        
        for user_data in SEED_USERS:
            # Check if user already exists
            result = await db.execute(select(User).filter(User.email == user_data["email"]))
            if result.scalars().first():
                print(f"  User {user_data['email']} already exists, skipping...")
                continue
            
            # Create user
            new_user = User(
                email=user_data["email"],
                password_hash=hash_password(user_data["password"])
            )
            db.add(new_user)
            await db.flush()
            
            # Create profile
            new_profile = Profile(
                user_id=new_user.id,
                full_name=user_data["full_name"],
                handle=user_data["handle"],
                headline=user_data["headline"],
                bio=user_data["bio"],
                location=user_data["location"],
                avatar_url=user_data["avatar_url"],
                streak_days=0,
                total_swaps=0,
                remaining_swipes=10,
                is_phone_verified=False,
            )
            db.add(new_profile)
            await db.flush()
            
            # Add skills
            for skill_name in user_data["skills_offered"]:
                db.add(UserSkill(profile_id=new_profile.id, skill_name=skill_name, type="OFFERED"))
            for skill_name in user_data["skills_wanted"]:
                db.add(UserSkill(profile_id=new_profile.id, skill_name=skill_name, type="WANTED"))
            
            print(f"  Created: {user_data['full_name']} (@{user_data['handle']})")
        
        await db.commit()
        print("Seed completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_users())