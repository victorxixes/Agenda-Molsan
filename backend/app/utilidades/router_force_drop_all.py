from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db

router = APIRouter(prefix="/force", tags=["Force"])

@router.delete("/drop_all")
def drop_all(db: Session = Depends(get_db)):
    db.execute(text("""
        DO $$
        DECLARE
            r RECORD;
        BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || r.tablename || ' CASCADE;';
            END LOOP;
        END $$;
    """))
    db.commit()
    return {"status": "ok", "message": "Todas las tablas eliminadas"}
