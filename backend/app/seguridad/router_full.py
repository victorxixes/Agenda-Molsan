
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.service import (
    listar_eventos,
    crear_evento,
    listar_auditoria,
    crear_auditoria
)
from backend.app.seguridad.schemas import (
    EventoCreate,
    Evento,
    AuditoriaCreate,
    AuditoriaOut
)

router = APIRouter(prefix="/seguridad", tags=["Seguridad Full"])

# ---------------------------------------------------------
# EVENTOS
# ---------------------------------------------------------
@router.get("/eventos", response_model=list[Evento])
def get_eventos(db: Session = Depends(get_db)):
    return listar_eventos(db)

@router.post("/eventos", response_model=Evento)
def post_evento(data: EventoCreate, db: Session = Depends(get_db)):
    return crear_evento(db, data)

# ---------------------------------------------------------
# AUDITORÍA
# ---------------------------------------------------------
@router.get("/auditoria", response_model=list[AuditoriaOut])
def get_auditoria(db: Session = Depends(get_db)):
    return listar_auditoria(db)

@router.post("/auditoria", response_model=AuditoriaOut)
def post_auditoria(data: AuditoriaCreate, db: Session = Depends(get_db)):
    return crear_auditoria(db, data)

# ---------------------------------------------------------
# LOGS (placeholder)
# ---------------------------------------------------------
@router.get("/logs")
def get_logs():
    return {"detail": "Logs no implementados aún"}

# ---------------------------------------------------------
# PERMISOS (placeholder)
# ---------------------------------------------------------
@router.get("/permisos")
def get_permisos():
    return {"detail": "Permisos OK"}

# ---------------------------------------------------------
# USUARIOS (placeholder)
# ---------------------------------------------------------
@router.get("/usuarios")
def get_usuarios():
    return {"detail": "Usuarios OK"}
