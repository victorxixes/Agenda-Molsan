from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.auditoria.service import (
    obtener_auditoria,
    obtener_metricas,
    registrar_auditoria
)

router = APIRouter(
    prefix="/seguridad/auditoria",
    tags=["Seguridad - Auditoría"]
)

# ---------------------------------------------------------
# LISTAR AUDITORÍA
# ---------------------------------------------------------
@router.get("/")
def listar_auditoria(db: Session = Depends(get_db)):
    return obtener_auditoria(db)

# ---------------------------------------------------------
# MÉTRICAS
# ---------------------------------------------------------
@router.get("/metricas")
def metricas(db: Session = Depends(get_db)):
    return obtener_metricas(db)

# ---------------------------------------------------------
# REGISTRAR AUDITORÍA (opcional)
# ---------------------------------------------------------
@router.post("/")
def registrar(
    usuario: str,
    modulo: str,
    accion: str,
    descripcion: str,
    ip: str | None = None,
    db: Session = Depends(get_db)
):
    return registrar_auditoria(db, usuario, modulo, accion, descripcion, ip)
