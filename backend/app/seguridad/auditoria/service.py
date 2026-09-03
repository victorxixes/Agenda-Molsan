from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.seguridad.auditoria.models import Auditoria

# ---------------------------------------------------------
# REGISTRAR AUDITORÍA
# ---------------------------------------------------------
def registrar_auditoria(db: Session, usuario: str, modulo: str, accion: str, descripcion: str, ip: str | None = None):
    registro = Auditoria(
        usuario=usuario,
        modulo=modulo,
        accion=accion,
        descripcion=descripcion,
        ip=ip,
        fecha=datetime.utcnow()
    )
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return registro


# ---------------------------------------------------------
# LISTAR AUDITORÍA
# ---------------------------------------------------------
def obtener_auditoria(db: Session):
    registros = db.query(Auditoria).order_by(Auditoria.fecha.desc()).limit(200).all()
    return [r.as_dict() for r in registros]


# ---------------------------------------------------------
# MÉTRICAS
# ---------------------------------------------------------
def obtener_metricas(db: Session):
    total = db.query(Auditoria).count()

    por_modulo = (
        db.query(Auditoria.modulo, func.count(Auditoria.id))
        .group_by(Auditoria.modulo)
        .all()
    )

    por_accion = (
        db.query(Auditoria.accion, func.count(Auditoria.id))
        .group_by(Auditoria.accion)
        .all()
    )

    ultimos_logins = (
        db.query(Auditoria)
        .filter(Auditoria.accion == "login")
        .order_by(Auditoria.fecha.desc())
        .limit(10)
        .all()
    )

    return {
        "total_registros": total,
        "por_modulo": [{"modulo": m, "cantidad": c} for m, c in por_modulo],
        "por_accion": [{"accion": a, "cantidad": c} for a, c in por_accion],
        "ultimos_logins": [u.as_dict() for u in ultimos_logins]
    }
