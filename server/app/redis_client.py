import redis.asyncio as aioredis
from app.config import settings

redis_client: aioredis.Redis | None = None

async def init_redis() -> aioredis.Redis:
    global redis_client
    if settings.REDIS_URL:
        redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            socket_timeout=5,
            socket_connect_timeout=5,
            max_connections=20,
            health_check_interval=30,
        )
    else:
        redis_client = aioredis.Redis(
            host="localhost",
            port=6379,
            db=0,
            encoding="utf-8",
            decode_responses=True,
            protocol=2,
            socket_timeout=5,
            socket_connect_timeout=5,
            max_connections=20,
            health_check_interval=30,
        )
    # Verify connection works
    await redis_client.ping()
    return redis_client

async def close_redis():
    global redis_client
    if redis_client:
        await redis_client.aclose()

def get_redis() -> aioredis.Redis:
    if redis_client is None:
        raise RuntimeError("Redis connection has not been initialized.")
    return redis_client