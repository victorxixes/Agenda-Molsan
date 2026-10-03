from datetime import date, datetime
from typing import Optional

from sqlalchemy.orm import Session

from backend.app.seguridad.logs.models import Log


# ============================================================
# REGISTRAR LOG
# ============================================================

def registrar_log(
    db: Session,
    evento: str,
    detalle: Optional[str] = None,
    ip: Optional[str] = None,
):
    registro = Log(
        evento=evento,
        detalle=detalle,
        ip=ip,
        fecha=datetime.utcnow(),
    )

    db.add(registro)
    db.commit()
    db.refresh(registro)

    return registro.as_dict()


# ============================================================
# OBTENER LOGS
# ============================================================

def obtener_logs(
    db: Session,
    evento: Optional[str] = None,
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
):
    query = db.query(Log)

    # --------------------------------------------------------
    # FILTRO EVENTO
    # --------------------------------------------------------

    if evento:
        texto = evento.strip()

        if texto:
            query = query.filter(
                Log.evento.ilike(f"%{texto}%")
            )

    # --------------------------------------------------------
    # FILTRO FECHA INICIO
    # --------------------------------------------------------

    if fecha_inicio:
        inicio = datetime.combine(
            fecha_inicio,
            datetime.min.time(),
        )

        query = query.filter(
            Log.fecha >= inicio
        )

    # --------------------------------------------------------
    # FILTRO FECHA FIN
    # --------------------------------------------------------

    if fecha_fin:
        fin = datetime.combine(
            fecha_fin,
            datetime.max.time(),
        )

        query = query.filter(
            Log.fecha <= fin
        )

    # --------------------------------------------------------
    # ORDEN MÁS RECIENTE PRIMERO
    # --------------------------------------------------------

    registros = (
        query
        .order_by(Log.fecha.desc())
        .limit(500)
        .all()
    )

    return [
        registro.as_dict()
        for registro in registros
    ]
