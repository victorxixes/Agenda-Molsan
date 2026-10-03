from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.seguridad.auditoria.models import Auditoria
from backend.app.empleados.models import Empleado


# ============================================================
# AUDITORÍA — SERVICE
# MOLSAN ERP SAAS PREMIUM 2027
# ============================================================
#
# IMPORTANTE:
#
# La tabla seguridad_auditoria NO tiene empleado_id.
#
# La relación con empleados se realiza mediante:
#
#     empleados.id
#          ↓
#     empleados.usuario
#          ↓
#     seguridad_auditoria.usuario
#
# De esta forma mantenemos intacto todo el histórico existente.
# ============================================================


# ============================================================
# REGISTRAR AUDITORÍA
# ============================================================

def registrar_auditoria(
    db: Session,
    usuario: str,
    modulo: str,
    accion: str,
    descripcion: str,
    ip: str | None = None,
):
    """
    Registra una nueva entrada de auditoría.

    No modifica registros históricos.
    """

    registro = Auditoria(
        usuario=usuario,
        modulo=modulo,
        accion=accion,
        descripcion=descripcion,
        ip=ip,
        fecha=datetime.utcnow(),
    )

    db.add(registro)

    db.commit()

    db.refresh(registro)

    return registro.as_dict()


# ============================================================
# OBTENER AUDITORÍA GLOBAL
# ============================================================

def obtener_auditoria(
    db: Session,
    limite: int = 200,
):
    """
    Devuelve los últimos registros de auditoría.

    Se ordenan de más recientes a más antiguos.
    """

    try:
        limite = int(limite)
    except (TypeError, ValueError):
        limite = 200

    limite = max(
        1,
        min(limite, 1000),
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
        registro.as_dict()
        for registro in registros
    ]


# ============================================================
# OBTENER AUDITORÍA POR USUARIO
# ============================================================

def obtener_auditoria_usuario(
    db: Session,
    usuario: str,
    limite: int = 100,
):
    """
    Obtiene la auditoría asociada directamente a un login.

    Se utiliza internamente cuando ya conocemos el campo
    empleados.usuario.
    """

    if not usuario:
        return []

    usuario = str(usuario).strip()

    if not usuario:
        return []

    try:
        limite = int(limite)
    except (TypeError, ValueError):
        limite = 100

    limite = max(
        1,
        min(limite, 1000),
    )

    registros = (
        db.query(Auditoria)
        .filter(
            Auditoria.usuario == usuario
        )
        .order_by(
            Auditoria.fecha.desc(),
            Auditoria.id.desc(),
        )
        .limit(limite)
        .all()
    )

    return [
        registro.as_dict()
        for registro in registros
    ]


# ============================================================
# OBTENER AUDITORÍA POR EMPLEADO
# ============================================================

def obtener_auditoria_empleado(
    db: Session,
    empleado_id: int,
    limite: int = 100,
):
    """
    Obtiene la auditoría de un empleado.

    La relación se resuelve mediante:

        empleados.id
            ↓
        empleados.usuario
            ↓
        seguridad_auditoria.usuario

    NO requiere modificar la tabla de auditoría.
    """

    if (
        empleado_id is None
        or empleado_id == ""
    ):
        return []

    try:
        empleado_id = int(empleado_id)
    except (TypeError, ValueError):
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

    usuario = (
        str(empleado.usuario).strip()
        if empleado.usuario
        else ""
    )

    if not usuario:
        return []

    return obtener_auditoria_usuario(
        db=db,
        usuario=usuario,
        limite=limite,
    )


# ============================================================
# MÉTRICAS DE AUDITORÍA
# ============================================================

def obtener_metricas(
    db: Session,
):
    """
    Devuelve métricas generales de auditoría.

    Incluye:

    - total de registros
    - registros agrupados por módulo
    - registros agrupados por acción
    - últimos logins
    """

    # --------------------------------------------------------
    # TOTAL
    # --------------------------------------------------------

    total_registros = (
        db.query(
            func.count(Auditoria.id)
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
            func.count(Auditoria.id),
        )
        .group_by(
            Auditoria.modulo
        )
        .order_by(
            func.count(Auditoria.id).desc()
        )
        .all()
    )

    # --------------------------------------------------------
    # POR ACCIÓN
    # --------------------------------------------------------

    por_accion = (
        db.query(
            Auditoria.accion,
            func.count(Auditoria.id),
        )
        .group_by(
            Auditoria.accion
        )
        .order_by(
            func.count(Auditoria.id).desc()
        )
        .all()
    )

    # --------------------------------------------------------
    # ÚLTIMOS LOGINS
    # --------------------------------------------------------
    #
    # Se aceptan ambas variantes:
    #
    # login
    # LOGIN
    #
    # La comparación se hace en minúsculas.
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
        .limit(10)
        .all()
    )

    # --------------------------------------------------------
    # RESULTADO
    # --------------------------------------------------------

    return {
        "total_registros": int(
            total_registros
        ),

        "por_modulo": [
            {
                "modulo": modulo,
                "cantidad": int(cantidad),
            }
            for modulo, cantidad
            in por_modulo
        ],

        "por_accion": [
            {
                "accion": accion,
                "cantidad": int(cantidad),
            }
            for accion, cantidad
            in por_accion
        ],

        "ultimos_logins": [
            registro.as_dict()
            for registro in ultimos_logins
        ],
    }
