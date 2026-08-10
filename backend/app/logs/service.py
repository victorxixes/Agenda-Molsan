from sqlalchemy.orm import Session
from datetime import datetime, date
from app.logs.models import Log
from app.logs.schemas import LogCreate

# ---------------------------------------------------------
# CREAR LOG
# ---------------------------------------------------------
def crear_log(db: Session, data: LogCreate):
    log = Log(**data.dict())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

# ---------------------------------------------------------
# LISTAR TODOS LOS LOGS
# ---------------------------------------------------------
def listar_logs(db: Session):
    return db.query(Log).order_by(Log.fecha.desc()).all()

# ---------------------------------------------------------
# FILTRAR POR USUARIO
# ---------------------------------------------------------
def logs_por_usuario(db: Session, usuario_id: int):
    return (
        db.query(Log)
        .filter(Log.usuario_id == usuario_id)
        .order_by(Log.fecha.desc())
        .all()
    )

# ---------------------------------------------------------
# FILTRAR POR MÓDULO
# ---------------------------------------------------------
def logs_por_modulo(db: Session, modulo: str):
    return (
        db.query(Log)
        .filter(Log.modulo == modulo)
        .order_by(Log.fecha.desc())
        .all()
    )

# ---------------------------------------------------------
# FILTRAR POR NIVEL (INFO, WARNING, ERROR)
# ---------------------------------------------------------
def logs_por_nivel(db: Session, nivel: str):
    return (
        db.query(Log)
        .filter(Log.nivel == nivel)
        .order_by(Log.fecha.desc())
        .all()
    )

# ---------------------------------------------------------
# FILTRAR POR FECHA
# ---------------------------------------------------------
def logs_por_fecha(db: Session, fecha: date):
    inicio = datetime.combine(fecha, datetime.min.time())
    fin = datetime.combine(fecha, datetime.max.time())

    return (
        db.query(Log)
        .filter(Log.fecha >= inicio)
        .filter(Log.fecha <= fin)
        .order_by(Log.fecha.desc())
        .all()
    )
