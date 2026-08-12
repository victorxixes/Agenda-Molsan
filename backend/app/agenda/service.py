from sqlalchemy.orm import Session
from datetime import date, timedelta, time
from app.agenda.models import Cita
from app.ctn.models import Notaria
from app.empleados.models import Empleado


# ---------------------------------------------------------
# CONVERTIR CITA → OBJETO COMPLETO PARA EL FRONTEND
# ---------------------------------------------------------
def cita_con_relaciones(db: Session, cita: Cita):
    if not cita:
        return None

    notario = None

    if cita.notario_id:
        notario = db.query(Notaria).filter(Notaria.id == cita.notario_id).first()

    return {
        "id": cita.id,
        "fecha": cita.fecha,
        "hora_inicio": cita.hora_inicio,
        "hora_fin": cita.hora_fin,
        "tipo_cita": cita.tipo_cita,
        "tipo_firma": cita.tipo_firma,
        "estado": cita.estado,
        "observaciones": cita.observaciones,
        "notario": notario,

        # 🔥 CAMBIO IMPORTANTE
        "apoderado": cita.apoderado
    }

    return {
        "id": cita.id,
        "fecha": cita.fecha,
        "hora_inicio": cita.hora_inicio,
        "hora_fin": cita.hora_fin,
        "tipo_cita": cita.tipo_cita,
        "tipo_firma": cita.tipo_firma,
        "estado": cita.estado,
        "observaciones": cita.observaciones,
        "notario": notario,
        "apoderado": apoderado
    }


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
    inicio = date(year, month, 1)
    fin = date(year, month, 31)

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


# ---------------------------------------------------------
# CAMBIAR ESTADO
# ---------------------------------------------------------
def cambiar_estado_cita(db: Session, cita_id: int, nuevo_estado: str):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        return None

    cita.estado = nuevo_estado

    db.commit()
    db.refresh(cita)
    return cita_con_relaciones(db, cita)
