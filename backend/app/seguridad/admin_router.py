from fastapi import APIRouter, Depends
from sqlalchemy import text
from backend.app.database import get_db   # según tu estructura real

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/install-unaccent")
def install_unaccent(db=Depends(get_db)):
    db.execute(text("CREATE EXTENSION IF NOT EXISTS unaccent;"))
    db.commit()
    return {"status": "ok", "message": "unaccent instalado correctamente"}

