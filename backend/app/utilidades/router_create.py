from fastapi import APIRouter
from backend.app.database import Base, engine

router = APIRouter(prefix="/force", tags=["Force"])

@router.post("/create_empleados_v2")
def create_empleados_v2():
    Base.metadata.create_all(bind=engine)
    return {"status": "ok", "message": "Tabla empleados_v2 creada correctamente"}

