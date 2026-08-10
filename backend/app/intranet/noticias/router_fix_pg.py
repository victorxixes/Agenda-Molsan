from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import engine, get_db
from app.intranet.noticias.models import Noticia

router = APIRouter(prefix="/admin/noticias", tags=["Admin Noticias"])

@router.post("/reset-pg")
def reset_pg(db: Session = Depends(get_db)):
    try:
        # BORRAR TABLA
        db.execute("DROP TABLE IF EXISTS intranet_noticias CASCADE;")
        db.commit()

        # RECREAR TABLA
        Noticia.__table__.create(engine)

        return {"status": "ok", "mensaje": "Tabla intranet_noticias recreada correctamente en PostgreSQL"}
    except Exception as e:
        return {"status": "error", "detalle": str(e)}
