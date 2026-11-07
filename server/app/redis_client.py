import redis.asyncio as aioredis
from app.config import settings

redis_client: aioredis.Redis | None = None

async def init_redis() -> aioredis.Redis:
    global redis_client
    redis_client = aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True
    )
    return redis_client

async def close_redis():
    global redis_client
    if redis_client:
        await redis_client.close()

def get_redis() -> aioredis.Redis:
    if redis_client is None:
        raise RuntimeError("Redis connection has not been initialized.")
    return redis_client