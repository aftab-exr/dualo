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

# Parse origins from .env and include Android Capacitor default webview origins
allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]
allowed_origins.extend(["http://localhost", "capacitor://localhost"])

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
    await init_redis()

@app.on_event("shutdown")
async def on_shutdown():
    await close_redis()

@app.get("/health", tags=["Telemetry"])
async def health_check(r: aioredis.Redis = Depends(get_redis)):
    redis_status = "connected" if await r.ping() else "disconnected"
    return {
        "status": "online",
        "service": "dualo-backend",
        "database": "supabase-postgres",
        "redis": redis_status
    }