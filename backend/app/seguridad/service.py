from sqlalchemy.orm import Session
from backend.app.empleados.models import Empleado

# -------------------------
# Serialización para el ERP
# -------------------------
def serializar_permisos(empleado: Empleado):
    """
    Devuelve los permisos del empleado en formato dict:
    {
        "agenda": ["ver", "crear", "editar"],
        "empleados": ["ver"],
        ...
    }
    """
    if not empleado.permisos_modulo_dict:
        return {}

    return empleado.permisos_modulo_dict


def serializar_modulos_visibles(empleado: Empleado):
    """
    Devuelve la lista de módulos visibles para el ERP.
    """
    if not empleado.modulos_visibles_list:
        return []

    return empleado.modulos_visibles_list


def serializar_empleado_seguridad(empleado: Empleado):
    """
    Estructura completa que el ERP necesita para cargar módulos.
    """
    return {
        "id": empleado.id,
        "nombre": empleado.nombre,
        "apellidos": empleado.apellidos,
        "usuario": empleado.usuario,
        "foto": empleado.foto,
        "rol_id": empleado.rol_id,
        "modulos_visibles": serializar_modulos_visibles(empleado),
        "permisos_modulo": serializar_permisos(empleado),
    }


# -------------------------
# Obtener permisos del empleado
# -------------------------
def obtener_permisos(db: Session, empleado_id: int):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    return {
        "modulos_visibles": serializar_modulos_visibles(empleado),
        "permisos_modulo": serializar_permisos(empleado),
    }


# -------------------------
# Asignar módulos visibles
# -------------------------
def asignar_modulos(db: Session, empleado_id: int, modulos: list):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    empleado.modulos_visibles_list = modulos
    db.commit()
    db.refresh(empleado)
    return serializar_empleado_seguridad(empleado)


# -------------------------
# Asignar permisos por módulo
# -------------------------
def asignar_permisos(db: Session, empleado_id: int, permisos: dict):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    empleado.permisos_modulo_dict = permisos
    db.commit()
    db.refresh(empleado)
    return serializar_empleado_seguridad(empleado)
