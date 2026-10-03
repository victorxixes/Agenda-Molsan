from datetime import datetime, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.seguridad.auditoria.models import Auditoria
from backend.app.empleados.models import Empleado


# ============================================================
# SEGURIDAD — AUDITORÍA SERVICE
# MOLSAN ERP SAAS
# ============================================================
#
# Responsabilidades:
#
# - Registrar auditoría
# - Obtener auditoría global
# - Obtener auditoría de un empleado
# - Obtener métricas
#
# IMPORTANTE:
#
# La auditoría GLOBAL y la auditoría POR EMPLEADO
# utilizan el mismo modelo Auditoria.
#
# La relación con el empleado se realiza mediante:
#
#     Auditoria.usuario
#     Empleado.usuario
#
# El endpoint por empleado recibe el ID numérico del empleado.
#
# ============================================================


# ============================================================
# CONFIGURACIÓN
# ============================================================

MAX_AUDITORIA_GLOBAL = 200
MAX_AUDITORIA_EMPLEADO = 100
MAX_ULTIMOS_LOGINS = 10


# ============================================================
# HELPERS
# ============================================================

def _texto(valor, fallback=None):
    """
    Convierte valores a texto de forma segura.
    """

    if valor is None:
        return fallback

    if isinstance(valor, str):
        valor = valor.strip()

        return valor if valor else fallback

    return str(valor)


def _registro_dict(registro: Auditoria):
    """
    Convierte un registro de Auditoria en un diccionario
    seguro para devolver desde FastAPI.
    """

    if not registro:
        return None

    return {
        "id": registro.id,

        "usuario": _texto(
            registro.usuario
        ),

        "modulo": _texto(
            registro.modulo
        ),

        "accion": _texto(
            registro.accion
        ),

        "descripcion": _texto(
            registro.descripcion
        ),

        "ip": _texto(
            registro.ip
        ),

        "fecha": (
            registro.fecha.isoformat()
            if registro.fecha
            else None
        ),
    }


# ============================================================
# REGISTRAR AUDITORÍA
# ============================================================

def registrar_auditoria(
    db: Session,
    usuario: str | None,
    modulo: str | None,
    accion: str | None,
    descripcion: str | None,
    ip: str | None = None,
):
    """
    Registra una operación en la tabla de auditoría.

    No requiere que exista un empleado.
    El campo usuario se conserva como texto para poder
    registrar también eventos del sistema.

    Devuelve el registro creado.
    """

    registro = Auditoria(
        usuario=_texto(usuario),
        modulo=_texto(modulo),
        accion=_texto(accion),
        descripcion=_texto(descripcion),
        ip=_texto(ip),
        fecha=datetime.now(timezone.utc).replace(
            tzinfo=None
        ),
    )

    try:

        db.add(registro)

        db.commit()

        db.refresh(registro)

        return registro

    except Exception:

        db.rollback()

        raise


# ============================================================
# OBTENER AUDITORÍA GLOBAL
# ============================================================

def obtener_auditoria(
    db: Session,
    limite: int = MAX_AUDITORIA_GLOBAL,
):
    """
    Devuelve los últimos registros de auditoría.

    Orden:
        más recientes primero.
    """

    try:
        limite = int(limite)

    except (TypeError, ValueError):
        limite = MAX_AUDITORIA_GLOBAL

    limite = max(
        1,
        min(
            limite,
            1000
        )
    )

    registros = (
        db.query(Auditoria)
        .order_by(
            Auditoria.fecha.desc(),
            Auditoria.id.desc(),
        )
        .limit(limite)
        .all()
    )

    return [
        _registro_dict(registro)
        for registro in registros
        if registro
    ]


# ============================================================
# OBTENER AUDITORÍA POR EMPLEADO
# ============================================================

def obtener_auditoria_empleado(
    db: Session,
    empleado_id: int,
):
    """
    Devuelve la auditoría correspondiente a un empleado.

    El router recibe el ID del empleado.

    Se busca primero:

        empleados.id

    y después se utiliza:

        empleados.usuario

    para localizar los registros de auditoría.

    Esto mantiene la tabla de auditoría desacoplada
    de la tabla empleados.
    """

    if empleado_id is None:
        return []

    try:
        empleado_id = int(
            empleado_id
        )

    except (TypeError, ValueError):
        return []

    if empleado_id <= 0:
        return []

    empleado = (
        db.query(Empleado)
        .filter(
            Empleado.id == empleado_id
        )
        .first()
    )

    if not empleado:
        return []

    usuario = _texto(
        empleado.usuario
    )

    if not usuario:
        return []

    registros = (
        db.query(Auditoria)
        .filter(
            Auditoria.usuario == usuario
        )
        .order_by(
            Auditoria.fecha.desc(),
            Auditoria.id.desc(),
        )
        .limit(
            MAX_AUDITORIA_EMPLEADO
        )
        .all()
    )

    return [
        _registro_dict(registro)
        for registro in registros
        if registro
    ]


# ============================================================
# MÉTRICAS
# ============================================================

def obtener_metricas(
    db: Session,
):
    """
    Devuelve las métricas generales de auditoría.
    """

    # --------------------------------------------------------
    # TOTAL
    # --------------------------------------------------------

    total = (
        db.query(
            func.count(
                Auditoria.id
            )
        )
        .scalar()
        or 0
    )

    # --------------------------------------------------------
    # POR MÓDULO
    # --------------------------------------------------------

    por_modulo = (
        db.query(
            Auditoria.modulo,
            func.count(
                Auditoria.id
            ).label("cantidad"),
        )
        .group_by(
            Auditoria.modulo
        )
        .order_by(
            func.count(
                Auditoria.id
            ).desc()
        )
        .all()
    )

    # --------------------------------------------------------
    # POR ACCIÓN
    # --------------------------------------------------------

    por_accion = (
        db.query(
            Auditoria.accion,
            func.count(
                Auditoria.id
            ).label("cantidad"),
        )
        .group_by(
            Auditoria.accion
        )
        .order_by(
            func.count(
                Auditoria.id
            ).desc()
        )
        .all()
    )

    # --------------------------------------------------------
    # ÚLTIMOS LOGINS
    # --------------------------------------------------------

    ultimos_logins = (
        db.query(Auditoria)
        .filter(
            func.lower(
                Auditoria.accion
            ) == "login"
        )
        .order_by(
            Auditoria.fecha.desc(),
            Auditoria.id.desc(),
        )
        .limit(
            MAX_ULTIMOS_LOGINS
        )
        .all()
    )

    # --------------------------------------------------------
    # RESULTADO
    # --------------------------------------------------------

    return {

        "total_registros": int(
            total
        ),

        "por_modulo": [
            {
                "modulo": (
                    _texto(
                        modulo,
                        "Sin módulo"
                    )
                ),
                "cantidad": int(
                    cantidad
                ),
            }
            for modulo, cantidad
            in por_modulo
        ],

        "por_accion": [
            {
                "accion": (
                    _texto(
                        accion,
                        "Sin acción"
                    )
                ),
                "cantidad": int(
                    cantidad
                ),
            }
            for accion, cantidad
            in por_accion
        ],

        "ultimos_logins": [
            _registro_dict(
                registro
            )
            for registro
            in ultimos_logins
            if registro
        ],
    }
