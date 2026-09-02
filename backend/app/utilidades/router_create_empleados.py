from fastapi import APIRouter
from backend.app.database import Base, engine

router = APIRouter(prefix="/force", tags=["Force"])

@router.post("/create_empleados")
def create_empleados():
    # recrea TODAS las tablas según el modelo actual
    Base.metadata.create_all(bind=engine)
    return {"status": "ok", "message": "Tabla empleados recreada correctamente"}
