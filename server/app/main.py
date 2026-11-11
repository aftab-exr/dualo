from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.redis_client import init_redis, close_redis, get_redis
from app.routers import auth, feed, chat, streaks
import redis.asyncio as aioredis

app = FastAPI(
    title="Dualo Skill-Barter API",
    description="Backend API service for Dualo mobile and web applications",
    version="1.0.0"
)

allowed_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
for default_origin in ["http://localhost:5173", "http://localhost:3000", "capacitor://localhost", "http://localhost"]:
    if default_origin not in allowed_origins:
        allowed_origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(feed.router)
app.include_router(chat.router)
app.include_router(streaks.router)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    try:
        await init_redis()
    except Exception as e:
        print(f"Notice: Redis connection unavailable at startup ({e}). Continuing in standalone mode.")

@app.on_event("shutdown")
async def on_shutdown():
    try:
        await close_redis()
    except Exception:
        pass

@app.get("/health", tags=["Telemetry"])
async def health_check():
    try:
        r = get_redis()
        redis_status = "connected" if await r.ping() else "disconnected"
    except Exception:
        redis_status = "disconnected"
    return {
        "status": "online",
        "service": "dualo-backend",
        "database": "supabase-postgres",
        "redis": redis_status
    }