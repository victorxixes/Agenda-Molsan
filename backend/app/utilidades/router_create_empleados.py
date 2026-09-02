from fastapi import APIRouter
from backend.app.database import Base, engine

router = APIRouter(prefix="/force", tags=["Force"])

@router.post("/create_empleados")
def create_empleados():
    Base.metadata.drop_all(bind=engine)   # 🔥 BORRA TODAS LAS TABLAS
    Base.metadata.create_all(bind=engine) # 🔥 LAS RECREA TODAS
    return {"status": "ok", "message": "Tablas recreadas correctamente"}
