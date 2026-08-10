from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db

from app.logs.service import (
    crear_log,
    listar_logs,
    logs_por_usuario,
    logs_por_modulo,
    logs_por_nivel,
    logs_por_fecha
)
from app.logs.schemas import LogCreate

router = APIRouter(prefix="/logs", tags=["Logs"])

# ---------------------------------------------------------
# CREAR LOG
# ---------------------------------------------------------
@router.post("/")
def crear(data: LogCreate, db: Session = Depends(get_db)):
    return crear_log(db, data)

# ---------------------------------------------------------
# LISTAR TODOS LOS LOGS
# ---------------------------------------------------------
@router.get("/")
def listar(db: Session = Depends(get_db)):
    return listar_logs(db)

# ---------------------------------------------------------
# LOGS POR USUARIO
# ---------------------------------------------------------
@router.get("/usuario/{usuario_id}")
def por_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return logs_por_usuario(db, usuario_id)

# ---------------------------------------------------------
# LOGS POR MÓDULO
# ---------------------------------------------------------
@router.get("/modulo/{modulo}")
def por_modulo(modulo: str, db: Session = Depends(get_db)):
    return logs_por_modulo(db, modulo)

# ---------------------------------------------------------
# LOGS POR NIVEL
# ---------------------------------------------------------
@router.get("/nivel/{nivel}")
def por_nivel(nivel: str, db: Session = Depends(get_db)):
    return logs_por_nivel(db, nivel)

# ---------------------------------------------------------
# LOGS POR FECHA
# ---------------------------------------------------------
@router.get("/fecha/{fecha}")
def por_fecha(fecha: str, db: Session = Depends(get_db)):
    f = date.fromisoformat(fecha)
    return logs_por_fecha(db, f)
