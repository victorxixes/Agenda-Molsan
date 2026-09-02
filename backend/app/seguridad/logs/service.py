from sqlalchemy.orm import Session
from backend.app.seguridad.logs.models import Log
from datetime import datetime

def registrar_log(db: Session, evento: str, detalle: str | None = None, ip: str | None = None):
    registro = Log(
        evento=evento,
        detalle=detalle,
        ip=ip,
        fecha=datetime.utcnow()
    )
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return registro


def obtener_logs(db: Session):
    return db.query(Log).order_by(Log.fecha.desc()).limit(200).all()
