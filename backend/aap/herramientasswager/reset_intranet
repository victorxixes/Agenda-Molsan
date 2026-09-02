from fastapi import APIRouter
from sqlalchemy import text
from backend.app.database import Base, engine

router = APIRouter(
    prefix="/utilidades",
    tags=["Utilidades"]
)

@router.post("/reset_intranet")
def reset_intranet():
    try:
        with engine.connect() as conn:
            # BORRAR SOLO LAS TABLAS DE INTRANET
            conn.execute(text("DROP TABLE IF EXISTS intranet_documentos CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS intranet_noticias CASCADE;"))
            conn.commit()

        # RECREAR TABLAS SEGÚN LOS MODELOS ACTUALES
        Base.metadata.create_all(bind=engine)

        return {
            "status": "ok",
            "message": "Tablas de Intranet (documentos y noticias) borradas y recreadas correctamente."
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
