from fastapi import APIRouter
from backend.app.database import Base, engine

router = APIRouter(
    prefix="/utilidades",
    tags=["Utilidades"]
)

@router.post("/crear_tablas")
def crear_tablas():
    try:
        Base.metadata.create_all(bind=engine)
        return {
            "status": "ok",
            "message": "Todas las tablas han sido creadas correctamente."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
