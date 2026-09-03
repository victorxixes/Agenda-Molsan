from sqlalchemy.orm import Session
from datetime import date, timedelta, time
from calendar import monthrange

from backend.app.agenda.models import Cita
from backend.app.ctn.models import Notaria
from backend.app.empleados.models import Empleado
from backend.app.agenda.schemas import CitaResponse


# ---------------------------------------------------------
# CONVERTIR CITA → OBJETO COMPLETO PARA EL FRONTEND
# ---------------------------------------------------------
def cita_con_relaciones(db: Session, cita: Cita):
    if not cita:
        return None

    # Relaciones ORM
    notario = cita.notario
    apoderado_obj = cita.apoderado

    # Tipo firma calculado desde VC
    tipo_firma = (
        "Videoconferencia" if cita.vc == "SI"
        else "Presencial" if cita.vc == "NO"
        else None
    )

    # Apoderado visible
    if apoderado_obj:
        apoderado_s = f"{apoderado_obj.nombre} {apoderado_obj.apellidos}"
    else:
        apoderado_s = cita.apoderado_s

    return CitaResponse(
        id=cita.id,
        fecha=cita.fecha,
        hora_inicio=cita.hora_inicio,
        hora_fin=cita.hora_fin,
        tipo_cita=cita.tipo_cita,

        vc=cita.vc,
        tipo_firma=tipo_firma,

        notario_id=cita.notario_id,
        notario=notario,

        apoderado_id=cita.apoderado_id,
        apoderado=apoderado_obj,
        apoderado_s=apoderado_s,

        observacion=cita.observacion,
        estado=None  # opcional
    )


# ---------------------------------------------------------
# OBTENER CITA POR ID
# ---------------------------------------------------------
def obtener_cita(db: Session, cita_id: int):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        return None
    return cita_con_relaciones(db, cita)


# ---------------------------------------------------------
# LISTAR CITAS POR DÍA
# ---------------------------------------------------------
def listar_citas_dia(db: Session, fecha: date):
    citas = (
        db.query(Cita)
        .filter(Cita.fecha == fecha)
        .order_by(Cita.hora_inicio.asc())
        .all()
    )
    return [cita_con_relaciones(db, c) for c in citas]


# ---------------------------------------------------------
# LISTAR CITAS POR SEMANA
# ---------------------------------------------------------
def listar_citas_semana(db: Session, fecha: date):
    inicio_semana = fecha
    fin_semana = fecha + timedelta(days=6)

    citas = (
        db.query(Cita)
        .filter(Cita.fecha >= inicio_semana)
        .filter(Cita.fecha <= fin_semana)
        .order_by(Cita.fecha.asc(), Cita.hora_inicio.asc())
        .all()
    )
    return [cita_con_relaciones(db, c) for c in citas]


# ---------------------------------------------------------
# LISTAR CITAS POR MES
# ---------------------------------------------------------
def listar_citas_mes(db: Session, year: int, month: int):
    last_day = monthrange(year, month)[1]

    inicio = date(year, month, 1)
    fin = date(year, month, last_day)

    citas = (
        db.query(Cita)
        .filter(Cita.fecha >= inicio)
        .filter(Cita.fecha <= fin)
        .order_by(Cita.fecha.asc(), Cita.hora_inicio.asc())
        .all()
    )
    return [cita_con_relaciones(db, c) for c in citas]


# ---------------------------------------------------------
# CREAR CITA
# ---------------------------------------------------------
def crear_cita(db: Session, data):
    cita = Cita(**data.dict())

    # Rellenar apoderado_s automáticamente
    if cita.apoderado_id:
        apo = db.query(Empleado).filter(Empleado.id == cita.apoderado_id).first()
        if apo:
            cita.apoderado_s = f"{apo.nombre} {apo.apellidos}"

    db.add(cita)
    db.commit()
    db.refresh(cita)
    return cita_con_relaciones(db, cita)


# ---------------------------------------------------------
# EDITAR CITA
# ---------------------------------------------------------
def editar_cita(db: Session, cita_id: int, data):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        return None

    for key, value in data.dict(exclude_unset=True).items():
        setattr(cita, key, value)

    db.commit()
    db.refresh(cita)
    return cita_con_relaciones(db, cita)


# ---------------------------------------------------------
# ELIMINAR CITA
# ---------------------------------------------------------
def eliminar_cita(db: Session, cita_id: int):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        return None

    db.delete(cita)
    db.commit()
    return True


# ---------------------------------------------------------
# MOVER CITA (drag & drop)
# ---------------------------------------------------------
def mover_cita(db: Session, cita_id: int, nueva_fecha: date, nueva_hora_inicio: time, nueva_hora_fin: time):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        return None

    cita.fecha = nueva_fecha
    cita.hora_inicio = nueva_hora_inicio
    cita.hora_fin = nueva_hora_fin

    db.commit()
    db.refresh(cita)
    return cita_con_relaciones(db, cita)
