from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, time

from app.database import get_db
from app.agenda.schemas import CitaCreate, CitaUpdate
from app.agenda.service import (
    listar_citas_dia,
    listar_citas_semana,
    listar_citas_mes,
    crear_cita,
    editar_cita,
    eliminar_cita,
    mover_cita,
    cambiar_estado_cita
)

router = APIRouter(prefix="/agenda", tags=["Agenda"])

# ---------------------------------------------------------
# LISTAR CITAS
# ---------------------------------------------------------
@router.get("/dia/{fecha}")
def citas_dia(fecha: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(fecha)
    return listar_citas_dia(db, fecha_dt)

@router.get("/semana/{fecha}")
def citas_semana(fecha: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(fecha)
    return listar_citas_semana(db, fecha_dt)

@router.get("/mes/{year}/{month}")
def citas_mes(year: int, month: int, db: Session = Depends(get_db)):
    return listar_citas_mes(db, year, month)

# ---------------------------------------------------------
# CREAR CITA
# ---------------------------------------------------------
@router.post("")
def crear(data: CitaCreate, db: Session = Depends(get_db)):
    return crear_cita(db, data)

# ---------------------------------------------------------
# EDITAR CITA
# ---------------------------------------------------------
@router.put("/{id}")
def editar(id: int, data: CitaUpdate, db: Session = Depends(get_db)):
    return editar_cita(db, id, data)

# ---------------------------------------------------------
# ELIMINAR CITA
# ---------------------------------------------------------
@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return eliminar_cita(db, id)

# ---------------------------------------------------------
# MOVER CITA (drag & drop)
# ---------------------------------------------------------
@router.put("/mover/{id}")
def mover(id: int, nueva_fecha: str, nueva_hora_inicio: str, nueva_hora_fin: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(nueva_fecha)
    hora_inicio_dt = time.fromisoformat(nueva_hora_inicio)
    hora_fin_dt = time.fromisoformat(nueva_hora_fin)
    return mover_cita(db, id, fecha_dt, hora_inicio_dt, hora_fin_dt)

# ---------------------------------------------------------
# CAMBIAR ESTADO
# ---------------------------------------------------------
@router.put("/estado/{id}")
def cambiar_estado(id: int, nuevo_estado: str, db: Session = Depends(get_db)):
    return cambiar_estado_cita(db, id, nuevo_estado)
