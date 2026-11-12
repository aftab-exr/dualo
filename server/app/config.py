import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://dualo_user:dualo_password@localhost:5432/dualo_db"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dualo_secret_key")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost,capacitor://localhost")
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")

    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse comma-separated ALLOWED_ORIGINS into a list, with defaults."""
        origins = [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]
        for default_origin in ["http://localhost:5173", "http://localhost:3000", "capacitor://localhost", "http://localhost"]:
            if default_origin not in origins:
                origins.append(default_origin)
        return origins

    @property
    def database_url_asyncpg(self) -> str:
        """Ensure asyncpg driver and return clean URL for alembic."""
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        # Remove any query parameters for alembic (connect_args used instead)
        if "?" in url:
            url = url.split("?")[0]
        return url

    class Config:
        env_file = ".env"

settings = Settings()
