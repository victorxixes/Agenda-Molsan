from sqlalchemy.orm import Session
from backend.app.seguridad.logs.models import Log
from datetime import datetime

# ---------------------------------------------------------
# REGISTRAR LOG
# ---------------------------------------------------------
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
    return registro.as_dict()


# ---------------------------------------------------------
# OBTENER LOGS
# ---------------------------------------------------------
def obtener_logs(db: Session):
    registros = db.query(Log).order_by(Log.fecha.desc()).limit(200).all()
    return [r.as_dict() for r in registros]
