from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/admin/noticias", tags=["Admin Noticias"])

@router.post("/fix-schema")
def fix_noticias_schema(db: Session = Depends(get_db)):
    try:
        db.execute("""
            ALTER TABLE intranet_noticias
            ALTER COLUMN usuario_id DROP NOT NULL;
        """)
        db.commit()
        return {"status": "ok", "mensaje": "usuario_id ahora permite NULL"}
    except Exception as e:
        return {"status": "error", "detalle": str(e)}
