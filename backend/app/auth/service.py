from datetime import datetime, timedelta
import jwt

from backend.app.config import settings
from backend.app.empleados.models import Empleado


# ---------------------------------------------------------
# CREAR TOKEN JWT
# ---------------------------------------------------------

def crear_token(empleado: Empleado):
    exp = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "id": empleado.id,
        "usuario": empleado.usuario,
        "rol_id": empleado.rol_id,
        "rol_nombre": empleado.rol.nombre if empleado.rol else None,
        "exp": exp
    }

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)


# ---------------------------------------------------------
# SERIALIZAR EMPLEADO PARA RESPUESTA
# ---------------------------------------------------------

def serializar_empleado(empleado: Empleado):
    return {
        "empleado_id": empleado.id,
        "nombre": empleado.nombre,
        "rol_id": empleado.rol_id,
        "rol_nombre": empleado.rol.nombre if empleado.rol else None,
        "modulos_visibles": empleado.modulos_visibles or [],
        "permisos_modulo": empleado.permisos_modulo or {}
    }
