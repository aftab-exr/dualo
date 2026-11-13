from app.routers.auth import router as auth_router
from app.routers.feed import router as feed_router
from app.routers.chat import router as chat_router
from app.routers.streaks import router as streaks_router

__all__ = ["auth_router", "feed_router", "chat_router", "streaks_router"]