from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.seguridad.auditoria.models import Auditoria
from backend.app.empleados.models import Empleado


# =========================================================
# HELPERS
# =========================================================

def _registro_dict(registro: Auditoria):
    """
    Convierte un registro de auditoría a un diccionario seguro.
    """

    return {
        "id": registro.id,
        "usuario": registro.usuario,
        "modulo": registro.modulo,
        "accion": registro.accion,
        "descripcion": registro.descripcion,
        "ip": registro.ip,
        "fecha": (
            registro.fecha.isoformat()
            if registro.fecha
            else None
        ),
    }


# =========================================================
# REGISTRAR
# =========================================================

def registrar_auditoria(
    db: Session,
    usuario: str,
    modulo: str,
    accion: str,
    descripcion: str,
    ip: str | None = None,
):
    """
    Registra una acción en la auditoría.

    El histórico actual utiliza el login del empleado
    en el campo `usuario`, por lo que mantenemos ese
    sistema para no romper registros anteriores.
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

    return _registro_dict(registro)


# =========================================================
# AUDITORÍA GLOBAL
# =========================================================

def obtener_auditoria(
    db: Session,
    limite: int = 200,
):
    """
    Obtiene los últimos registros de auditoría.

    Se limita el máximo para evitar cargar un histórico
    gigantesco en una sola petición.
    """

    limite = max(
        1,
        min(
            int(limite),
            1000,
        ),
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
    ]


# =========================================================
# AUDITORÍA POR EMPLEADO
# =========================================================

def obtener_auditoria_empleado(
    db: Session,
    empleado_id: int,
    limite: int = 100,
):
    """
    Obtiene la auditoría correspondiente a un empleado.

    IMPORTANTE:

    La ruta recibe `empleado_id`.

    La tabla seguridad_auditoria actualmente no tiene
    una columna empleado_id; conserva el login en `usuario`.

    Por ello:

        empleado_id
             ↓
        Empleado
             ↓
        Empleado.usuario
             ↓
        Auditoria.usuario

    De esta forma podemos consultar correctamente tanto
    el histórico nuevo como el histórico existente.
    """

    if (
        empleado_id is None
        or empleado_id == ""
    ):
        return []

    try:
        empleado_id = int(
            empleado_id
        )
    except (
        TypeError,
        ValueError,
    ):
        return []

    limite = max(
        1,
        min(
            int(limite),
            500,
        ),
    )

    # -----------------------------------------------------
    # BUSCAR EMPLEADO
    # -----------------------------------------------------

    empleado = (
        db.query(Empleado)
        .filter(
            Empleado.id == empleado_id
        )
        .first()
    )

    if not empleado:
        return []

    # -----------------------------------------------------
    # OBTENER LOGIN
    # -----------------------------------------------------

    usuario = getattr(
        empleado,
        "usuario",
        None,
    )

    if not usuario:
        return []

    usuario = str(
        usuario
    ).strip()

    if not usuario:
        return []

    # -----------------------------------------------------
    # BUSCAR AUDITORÍA
    # -----------------------------------------------------

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
        _registro_dict(registro)
        for registro in registros
    ]


# =========================================================
# MÉTRICAS
# =========================================================

def obtener_metricas(
    db: Session,
):
    """
    Devuelve estadísticas generales de auditoría.
    """

    # -----------------------------------------------------
    # TOTAL
    # -----------------------------------------------------

    total = (
        db.query(Auditoria)
        .count()
    )

    # -----------------------------------------------------
    # POR MÓDULO
    # -----------------------------------------------------

    por_modulo = (
        db.query(
            Auditoria.modulo,
            func.count(
                Auditoria.id
            ),
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

    # -----------------------------------------------------
    # POR ACCIÓN
    # -----------------------------------------------------

    por_accion = (
        db.query(
            Auditoria.accion,
            func.count(
                Auditoria.id
            ),
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

    # -----------------------------------------------------
    # ÚLTIMOS LOGINS
    # -----------------------------------------------------

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

    return {
        "total_registros": total,

        "por_modulo": [
            {
                "modulo": modulo,
                "cantidad": cantidad,
            }
            for modulo, cantidad
            in por_modulo
        ],

        "por_accion": [
            {
                "accion": accion,
                "cantidad": cantidad,
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
        ],
    }
