from datetime import datetime, timedelta
import jwt

from backend.app.empleados.models import Empleado


# Configuración del token
SECRET = "SUPER_SECRETO_CAMBIAR"
ALGORITHM = "HS256"
EXPIRACION_MINUTOS = 480


# ---------------------------------------------------------
# CREAR TOKEN JWT
# ---------------------------------------------------------
def crear_token(empleado: Empleado):
    exp = datetime.utcnow() + timedelta(minutes=EXPIRACION_MINUTOS)

    payload = {
        "sub": empleado.id,
        "exp": exp,
        "rol": empleado.rol,
        "modulos": empleado.modulos_visibles,
        "permisos": empleado.permisos_modulo
    }

    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


# ---------------------------------------------------------
# SERIALIZAR EMPLEADO PARA RESPUESTA
# ---------------------------------------------------------
def serializar_empleado(empleado: Empleado):
    return {
        "empleado_id": empleado.id,
        "nombre": empleado.nombre,
        "rol": empleado.rol,
        "modulos": empleado.modulos_visibles,
        "permisos": empleado.permisos_modulo
    }
