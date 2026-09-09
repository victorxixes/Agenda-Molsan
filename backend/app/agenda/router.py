from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, time

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
    obtener_cita,
    cita_con_relaciones,
)

# WebSocket manager
from backend.app.websockets.agenda_ws import enviar_evento

router = APIRouter(prefix="/agenda", tags=["Agenda"])


# -----------------------------
# BÚSQUEDA
# -----------------------------
@router.get("/search", response_model=list[CitaResponse])
def buscar_citas(
    query: str | None = None,
    notario_id: int | None = None,
    apoderado_id: int | None = None,
    tipo_cita: str | None = None,
    fecha: str | None = None,
    desde: str | None = None,
    hasta: str | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Cita)

    if query:
        q = q.filter(
            (Cita.tipo_cita.ilike(f"%{query}%"))
            | (Cita.observaciones.ilike(f"%{query}%"))
        )

    if notario_id:
        q = q.filter(Cita.notario_id == notario_id)

    if apoderado_id:
        q = q.filter(Cita.apoderado_id == apoderado_id)

    if tipo_cita:
        q = q.filter(Cita.tipo_cita.ilike(f"%{tipo_cita}%"))

    if fecha:
        q = q.filter(Cita.fecha == date.fromisoformat(fecha))

    if desde:
        q = q.filter(Cita.fecha >= date.fromisoformat(desde))

    if hasta:
        q = q.filter(Cita.fecha <= date.fromisoformat(hasta))

    citas = q.order_by(Cita.fecha.asc(), Cita.hora_inicio.asc()).all()
    return [cita_con_relaciones(db, c) for c in citas]


# -----------------------------
# OBTENER CITA
# -----------------------------
@router.get("/{id}", response_model=CitaResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    cita = obtener_cita(db, id)
    if not cita:
        raise HTTPException(404, "Cita no encontrada")
    return cita


# -----------------------------
# VISTAS: DÍA / SEMANA / MES
# -----------------------------
@router.get("/dia/{fecha}", response_model=list[CitaResponse])
def citas_dia(fecha: str, db: Session = Depends(get_db)):
    return listar_citas_dia(db, date.fromisoformat(fecha))


@router.get("/semana/{fecha}", response_model=list[CitaResponse])
def citas_semana(fecha: str, db: Session = Depends(get_db)):
    return listar_citas_semana(db, date.fromisoformat(fecha))


@router.get("/mes/{year}/{month}", response_model=list[CitaResponse])
def citas_mes(year: int, month: int, db: Session = Depends(get_db)):
    return listar_citas_mes(db, year, month)


# -----------------------------
# CREAR CITA (CON WS)
# -----------------------------
@router.post("/", response_model=CitaResponse)
async def create_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    nueva = crear_cita(db, cita)
    await enviar_evento("crear", nueva)
    return nueva


# -----------------------------
# EDITAR CITA (CON WS)
# -----------------------------
@router.put("/{id}", response_model=CitaResponse)
async def editar(id: int, data: CitaUpdate, db: Session = Depends(get_db)):
    editada = editar_cita(db, id, data)
    if not editada:
        raise HTTPException(404, "Cita no encontrada")

    await enviar_evento("editar", editada)
    return editada


# -----------------------------
# ELIMINAR CITA (CON WS)
# -----------------------------
@router.delete("/{id}")
async def eliminar(id: int, db: Session = Depends(get_db)):
    if not eliminar_cita(db, id):
        raise HTTPException(404, "Cita no encontrada")

    await enviar_evento("eliminar", {"id": id})
    return {"detail": "Cita eliminada correctamente"}


# -----------------------------
# MOVER CITA (SIN WS)
# -----------------------------
@router.put("/mover/{id}", response_model=CitaResponse)
def mover(id: int, nueva_fecha: str, nueva_hora_inicio: str, nueva_hora_fin: str, db: Session = Depends(get_db)):
    movida = mover_cita(
        db,
        id,
        date.fromisoformat(nueva_fecha),
        time.fromisoformat(nueva_hora_inicio),
        time.fromisoformat(nueva_hora_fin),
    )
    if not movida:
        raise HTTPException(404, "Cita no encontrada")
    return movida


# -----------------------------
# FIX TABLE
# -----------------------------
from backend.app.agenda.fix_table import fix_table

@router.post("/fix-table")
def ejecutar_fix_table():
    fix_table()
    return {"status": "ok", "message": "agenda_citas recreada correctamente"}
