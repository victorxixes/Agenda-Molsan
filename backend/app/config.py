import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Agenda Intranet")

    # -------------------------
    # DATABASE (Render PostgreSQL)
    # -------------------------
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL no está definida en el entorno")

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
