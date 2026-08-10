import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Agenda Intranet")

    # -------------------------
    # DATABASE
    # -------------------------
    raw_url = os.getenv("DATABASE_URL", "sqlite:///./app.db")

    # Render usa postgres:// pero SQLAlchemy exige postgresql://
    if raw_url.startswith("postgres://"):
        raw_url = raw_url.replace("postgres://", "postgresql://", 1)

    DATABASE_URL: str = raw_url

    # -------------------------
    # JWT
    # -------------------------
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecret")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

    # -------------------------
    # DEBUG
    # -------------------------
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"


settings = Settings()
