from sqlalchemy.orm import Session
from datetime import date, timedelta, time
from calendar import monthrange

from backend.app.agenda.models import Cita
from backend.app.ctn.models import Notaria
from backend.app.empleados.models import Empleado
from backend.app.agenda.schemas import CitaResponse


def cita_con_relaciones(db: Session, cita: Cita):
    # Obtener notario
    notario = None
    if cita.notario_id:
        notario = db.query(Empleado).filter(Empleado.id == cita.notario_id).first()

    # Obtener apoderado
    apoderado = None
    if cita.apoderado_id:
        apoderado = db.query(Empleado).filter(Empleado.id == cita.apoderado_id).first()

    return {
        "id": cita.id,
        "fecha": cita.fecha,
        "hora_inicio": cita.hora_inicio,
        "hora_fin": cita.hora_fin,
        "tipo_cita": cita.tipo_cita,
        "tipo_firma": cita.tipo_firma,
        "observaciones": cita.observaciones,

        # Relaciones
        "notario_id": cita.notario_id,
        "notario_nombre": f"{notario.nombre} {notario.apellidos}" if notario else None,
        "notario": notario,

        "apoderado_id": cita.apoderado_id,
        "apoderado_nombre": f"{apoderado.nombre} {apoderado.apellidos}" if apoderado else None,
        "apoderado": apoderado,
    }


    return CitaResponse(
        id=cita.id,
        fecha=cita.fecha,
        hora_inicio=cita.hora_inicio,
        hora_fin=cita.hora_fin,
        tipo_cita=cita.tipo_cita,
        notario_id=cita.notario_id,
        tipo_firma=cita.tipo_firma,
        apoderado_id=cita.apoderado_id,
        observaciones=cita.observaciones,
        estado=cita.estado,
        notario=notario,
        apoderado=apoderado_obj,
    )


def obtener_cita(db: Session, cita_id: int):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        return None
    return cita_con_relaciones(db, cita)


def listar_citas_dia(db: Session, fecha: date):
    citas = (
        db.query(Cita)
        .filter(Cita.fecha == fecha)
        .order_by(Cita.hora_inicio.asc())
        .all()
    )
    return [cita_con_relaciones(db, c) for c in citas]


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


def _rellenar_desde_notario(db: Session, cita: Cita):
    if not cita.notario_id:
        return

    notaria = db.query(Notaria).filter(Notaria.id == cita.notario_id).first()
    if not notaria:
        return

    # Tipo de firma desde vc (si la usas como tal)
    if not cita.tipo_firma and notaria.vc:
        cita.tipo_firma = notaria.vc

    # Apoderado desde notario
    if not cita.apoderado_id and notaria.apoderado_id:
        cita.apoderado_id = notaria.apoderado_id

    # Observaciones desde notario
    if not cita.observaciones and notaria.observacion:
        cita.observaciones = notaria.observacion


def crear_cita(db: Session, data):
    cita = Cita(**data.dict())

    _rellenar_desde_notario(db, cita)

    db.add(cita)
    db.commit()
    db.refresh(cita)
    return cita_con_relaciones(db, cita)


def editar_cita(db: Session, cita_id: int, data):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        return None

    for key, value in data.dict(exclude_unset=True).items():
        setattr(cita, key, value)

    _rellenar_desde_notario(db, cita)

    db.commit()
    db.refresh(cita)
    return cita_con_relaciones(db, cita)


def eliminar_cita(db: Session, cita_id: int):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        return None

    db.delete(cita)
    db.commit()
    return True


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
