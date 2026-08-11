from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, time
from app.database import get_db

from app.agenda.models import Cita
from app.agenda.service import (
    listar_citas_mes,
    listar_citas_dia,
    listar_citas_semana,
    mover_cita,
    cambiar_estado_cita,
    crear_cita,
    editar_cita,
    eliminar_cita,
    cita_con_relaciones
)

from app.agenda.schemas import CitaCreate, CitaUpdate
from app.empleados.models import Empleado
from app.ctn.models import Notaria

router = APIRouter(prefix="/agenda", tags=["Agenda"])


@router.get("/citas/{cita_id}")
def obtener_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita_con_relaciones(db, cita)


@router.get("/tipos-cita")
def obtener_tipos_cita():
    return [
        {"id": 1, "nombre": "Firma notarial"},
        {"id": 2, "nombre": "Reunión"},
        {"id": 3, "nombre": "Visita"},
        {"id": 4, "nombre": "Otros"},
    ]


@router.get("/tipos-firma")
def obtener_tipos_firma():
    return [
        {"id": 1, "nombre": "Presencial"},
        {"id": 2, "nombre": "Videoconferencia"},
    ]


@router.get("/apoderados")
def obtener_apoderados(db: Session = Depends(get_db)):
    apoderados = (
        db.query(Empleado)
        .filter(Empleado.activo == True)
        .order_by(Empleado.nombre.asc())
        .all()
    )

    return [
        {"id": a.id, "nombre": a.nombre, "apellidos": a.apellidos}
        for a in apoderados
    ]


@router.get("/notarios")
def obtener_notarios(db: Session = Depends(get_db)):
    notarios = db.query(Notaria).order_by(Notaria.nombre.asc()).all()

    return [
        {
            "id": n.id,
            "codigo": n.codigo,
            "nombre": n.nombre,
            "apellidos": n.apellidos,
            "nif": n.nif,
            "telefono": n.telefono,
            "departamento_cancelaciones": n.departamento_cancelaciones,
            "departamento_copias": n.departamento_copias,
            "otros_departamentos": n.otros_departamentos,
            "cp": n.cp,
            "provincia": n.provincia,
            "municipio": n.municipio,
            "vc": n.vc,
            "apoderado": n.apoderado,
            "apoderado_s": n.apoderado_s,
            "observacion": n.observacion
        }
        for n in notarios
    ]


@router.get("/citas/dia/{fecha}")
def citas_dia(fecha: str, db: Session = Depends(get_db)):
    f = date.fromisoformat(fecha)
    return listar_citas_dia(db, f)


@router.get("/citas/semana/{fecha}")
def citas_semana(fecha: str, db: Session = Depends(get_db)):
    f = date.fromisoformat(fecha)
    return listar_citas_semana(db, f)


@router.get("/citas/mes/{year}/{month}")
def citas_mes(year: int, month: int, db: Session = Depends(get_db)):
    return listar_citas_mes(db, year, month)


@router.post("")
def crear(data: CitaCreate, db: Session = Depends(get_db)):
    try:
        return crear_cita(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{cita_id}")
def editar(cita_id: int, data: CitaUpdate, db: Session = Depends(get_db)):
    cita = editar_cita(db, cita_id, data)
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita


@router.delete("/{cita_id}")
def eliminar(cita_id: int, db: Session = Depends(get_db)):
    ok = eliminar_cita(db, cita_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return {"message": "Cita eliminada correctamente"}


@router.put("/citas/mover/{cita_id}")
def mover(
    cita_id: int,
    nueva_fecha: str,
    nueva_hora_inicio: str,
    nueva_hora_fin: str,
    db: Session = Depends(get_db)
):
    f = date.fromisoformat(nueva_fecha)
    hi = time.fromisoformat(nueva_hora_inicio)
    hf = time.fromisoformat(nueva_hora_fin)

    cita = mover_cita(db, cita_id, f, hi, hf)
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita


@router.put("/citas/estado/{cita_id}")
def cambiar_estado(cita_id: int, nuevo_estado: str, db: Session = Depends(get_db)):
    cita = cambiar_estado_cita(db, cita_id, nuevo_estado)
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita
