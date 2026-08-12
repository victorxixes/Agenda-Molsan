from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import engine, get_db
from backend.app.intranet.noticias.models import Noticia

router = APIRouter(prefix="/admin/noticias", tags=["Admin Noticias"])

@router.post("/reset-pg")
def reset_pg(db: Session = Depends(get_db)):
    try:
        # BORRAR TABLA REAL EN POSTGRESQL
        db.execute("DROP TABLE IF EXISTS intranet_noticias CASCADE;")
        db.commit()

        # RECREAR TABLA SEGÚN EL MODELO
        Noticia.__table__.create(engine)

        return {
            "status": "ok",
            "mensaje": "Tabla intranet_noticias recreada correctamente en PostgreSQL"
        }

    except Exception as e:
        return {
            "status": "error",
            "detalle": str(e)
        }
