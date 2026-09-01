from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ⭐ FORZAMOS SQLITE (ignoramos settings)
DATABASE_URL = "sqlite:///./molsan.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}   # obligatorio en SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
