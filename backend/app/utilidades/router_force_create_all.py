from fastapi import APIRouter
from backend.app.database import Base, engine

router = APIRouter(prefix="/force", tags=["Force"])

@router.post("/create_all")
def create_all():
    Base.metadata.create_all(bind=engine)
    return {"status": "ok", "message": "Todas las tablas recreadas correctamente"}
