from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.service import listar_eventos, crear_evento
from backend.app.seguridad.schemas import EventoCreate, Evento

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

# GET /api/seguridad/eventos
@router.get("/eventos", response_model=list[Evento])
def get_eventos(db: Session = Depends(get_db)):
    return listar_eventos(db)

# POST /api/seguridad/eventos
@router.post("/eventos", response_model=Evento)
def post_evento(data: EventoCreate, db: Session = Depends(get_db)):
    return crear_evento(db, data)

# GET /api/seguridad/logs
@router.get("/logs")
def get_logs():
    return {"detail": "Logs no implementados aún"}

# GET /api/seguridad/permisos
@router.get("/permisos")
def get_permisos():
    return {"detail": "Permisos OK"}

# GET /api/seguridad/usuarios
@router.get("/usuarios")
def get_usuarios():
    return {"detail": "Usuarios OK"}
