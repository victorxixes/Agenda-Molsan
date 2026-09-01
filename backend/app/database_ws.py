from sqlalchemy.orm import sessionmaker
from backend.app.database import engine

SessionLocalWS = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db_ws():
    db = SessionLocalWS()
    try:
        yield db
    finally:
        db.close()
