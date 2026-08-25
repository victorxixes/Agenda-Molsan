from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, time
from sqlalchemy import text

from backend.app.database import get_db
from backend.app.agenda.schemas import CitaCreate, CitaUpdate, CitaResponse
from backend.app.agenda.models import Cita

from backend.app.agenda.service import (
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
# SANEAR CITA (evita errores 500)
# ---------------------------------------------------------
def _sanear(c: Cita):
    # Notario
    if hasattr(c, "notario") and c.notario:
        c.notario = {
            "id": c.notario_id,
            "nombre": getattr(c.notario, "nombre", None),
            "apellidos": getattr(c.notario, "apellidos", None),
            "direccion": getattr(c.notario, "direccion", None),
        }

    # Apoderado
    if hasattr(c, "apoderado") and c.apoderado:
        c.apoderado = {
            "id": c.apoderado_id,
            "nombre": getattr(c.apoderado, "nombre", None),
            "apellidos": getattr(c.apoderado, "apellidos", None),
        }

    return c


# ---------------------------------------------------------
# LISTAR CITAS
# ---------------------------------------------------------
@router.get("/dia/{fecha}", response_model=list[CitaResponse])
def citas_dia(fecha: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(fecha)
    citas = listar_citas_dia(db, fecha_dt)
    return [_sanear(c) for c in citas]


@router.get("/semana/{fecha}", response_model=list[CitaResponse])
def citas_semana(fecha: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(fecha)
    citas = listar_citas_semana(db, fecha_dt)
    return [_sanear(c) for c in citas]


@router.get("/mes/{year}/{month}", response_model=list[CitaResponse])
def citas_mes(year: int, month: int, db: Session = Depends(get_db)):
    citas = listar_citas_mes(db, year, month)
    return [_sanear(c) for c in citas]


# ---------------------------------------------------------
# CREAR CITA
# ---------------------------------------------------------
@router.post("/", response_model=CitaResponse)
def create_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    nueva = crear_cita(db, cita)
    return _sanear(nueva)


# ---------------------------------------------------------
# EDITAR CITA
# ---------------------------------------------------------
@router.put("/{id}", response_model=CitaResponse)
def editar(id: int, data: CitaUpdate, db: Session = Depends(get_db)):
    editada = editar_cita(db, id, data)
    return _sanear(editada)


# ---------------------------------------------------------
# ELIMINAR CITA
# ---------------------------------------------------------
@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    eliminar_cita(db, id)
    return {"detail": "Cita eliminada correctamente"}


# ---------------------------------------------------------
# MOVER CITA
# ---------------------------------------------------------
@router.put("/mover/{id}", response_model=CitaResponse)
def mover(id: int, nueva_fecha: str, nueva_hora_inicio: str, nueva_hora_fin: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(nueva_fecha)
    hora_inicio_dt = time.fromisoformat(nueva_hora_inicio)
    hora_fin_dt = time.fromisoformat(nueva_hora_fin)
    movida = mover_cita(db, id, fecha_dt, hora_inicio_dt, hora_fin_dt)
    return _sanear(movida)


# ---------------------------------------------------------
# CAMBIAR ESTADO
# ---------------------------------------------------------
@router.put("/estado/{id}", response_model=CitaResponse)
def cambiar_estado(id: int, nuevo_estado: str, db: Session = Depends(get_db)):
    cambiada = cambiar_estado_cita(db, id, nuevo_estado)
    return _sanear(cambiada)
