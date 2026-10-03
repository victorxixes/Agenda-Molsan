from datetime import datetime

from sqlalchemy.orm import Session

from backend.app.seguridad.logs.models import Log


# ============================================================
# REGISTRAR LOG
# ============================================================

def registrar_log(
    db: Session,
    evento: str,
    detalle: str | None = None,
    ip: str | None = None
):
    """
    Registra un nuevo evento en seguridad_logs.

    Se mantiene el histórico existente y se devuelve
    el registro recién creado en formato diccionario.
    """

    registro = Log(
        evento=evento,
        detalle=detalle,
        ip=ip,
        fecha=datetime.utcnow()
    )

    try:

        db.add(registro)

        db.commit()

        db.refresh(registro)

        return registro.as_dict()

    except Exception:

        db.rollback()

        raise


# ============================================================
# OBTENER LOGS
# ============================================================

def obtener_logs(
    db: Session,
    limite: int = 200
):
    """
    Obtiene los últimos logs registrados.

    Los más recientes aparecen primero.
    """

    limite = max(
        1,
        min(int(limite), 1000)
    )

    registros = (
        db.query(Log)
        .order_by(
            Log.fecha.desc(),
            Log.id.desc()
        )
        .limit(limite)
        .all()
    )

    return [
        registro.as_dict()
        for registro in registros
    ]
