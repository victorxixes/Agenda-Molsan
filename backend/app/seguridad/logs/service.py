from datetime import date, datetime
from typing import Optional

from sqlalchemy.orm import Session

from backend.app.seguridad.logs.models import Log


# ============================================================
# SEGURIDAD — LOGS SERVICE
# MOLSAN ERP SAAS PREMIUM 2027
# ============================================================


# ============================================================
# REGISTRAR LOG
# ============================================================


def registrar_log(
    db: Session,
    evento: str,
    detalle: Optional[str] = None,
    ip: Optional[str] = None,
):
    """
    Registra un evento técnico del sistema.

    Ejemplos:

        login_error
        login_success
        api_error
        system_error
        warning
        import_start
        import_finished
        import_error
    """

    evento = (
        str(evento).strip()
        if evento is not None
        else ""
    )

    if not evento:
        raise ValueError(
            "El evento del log es obligatorio."
        )

    registro = Log(
        evento=evento[:200],
        detalle=(
            str(detalle)[:1000]
            if detalle is not None
            else None
        ),
        ip=(
            str(ip)[:50]
            if ip is not None
            else None
        ),
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
    limite: int = 200,
):
    """
    Obtiene logs técnicos.

    Filtros disponibles:

        evento
        fecha_inicio
        fecha_fin

    Siempre devuelve los registros más recientes primero.
    """

    # --------------------------------------------------------
    # VALIDAR LÍMITE
    # --------------------------------------------------------

    try:
        limite = int(limite)
    except (TypeError, ValueError):
        limite = 200

    limite = max(
        1,
        min(limite, 1000),
    )

    # --------------------------------------------------------
    # QUERY BASE
    # --------------------------------------------------------

    query = db.query(Log)

    # --------------------------------------------------------
    # FILTRO EVENTO
    # --------------------------------------------------------

    if evento:

        texto = str(evento).strip()

        if texto:

            query = query.filter(
                Log.evento.ilike(
                    f"%{texto}%"
                )
            )

    # --------------------------------------------------------
    # FECHA INICIO
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
    # FECHA FIN
    # --------------------------------------------------------

    if fecha_fin:

        # Utilizamos el inicio del día siguiente
        # para evitar problemas con microsegundos.

        fin_exclusivo = datetime.combine(
            fecha_fin,
            datetime.min.time(),
        )

        # Sumamos un día.

        from datetime import timedelta

        fin_exclusivo += timedelta(
            days=1
        )

        query = query.filter(
            Log.fecha < fin_exclusivo
        )

    # --------------------------------------------------------
    # ORDEN
    # --------------------------------------------------------

    registros = (
        query
        .order_by(
            Log.fecha.desc(),
            Log.id.desc(),
        )
        .limit(limite)
        .all()
    )

    # --------------------------------------------------------
    # RESULTADO
    # --------------------------------------------------------

    return [
        registro.as_dict()
        for registro in registros
    ]
