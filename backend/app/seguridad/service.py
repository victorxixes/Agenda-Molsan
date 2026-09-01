from sqlalchemy.orm import Session
from backend.app.seguridad.models import Rol
from backend.app.seguridad.schemas import RolCreate, RolUpdate

# ---------------------------------------------------------
# CREAR ROL
# ---------------------------------------------------------
def crear_rol(db: Session, data: RolCreate):
    rol = Rol(
        nombre=data.nombre,
        descripcion=data.descripcion,
        permisos_modulo_dict=data.permisos_modulo_dict or {},
        modulos_visibles_list=data.modulos_visibles_list or [],
    )

    db.add(rol)
    db.commit()
    db.refresh(rol)
    return rol


# ---------------------------------------------------------
# LISTAR ROLES
# ---------------------------------------------------------
def listar_roles(db: Session):
    return db.query(Rol).all()


# ---------------------------------------------------------
# OBTENER ROL
# ---------------------------------------------------------
def obtener_rol(db: Session, rol_id: int):
    return db.query(Rol).filter(Rol.id == rol_id).first()


# ---------------------------------------------------------
# EDITAR ROL
# ---------------------------------------------------------
def editar_rol(db: Session, rol_id: int, data: RolUpdate):
    rol = obtener_rol(db, rol_id)
    if not rol:
        return None

    if data.nombre is not None:
        rol.nombre = data.nombre

    if data.descripcion is not None:
        rol.descripcion = data.descripcion

    if data.permisos_modulo_dict is not None:
        rol.permisos_modulo_dict = data.permisos_modulo_dict

    if data.modulos_visibles_list is not None:
        rol.modulos_visibles_list = data.modulos_visibles_list

    db.commit()
    db.refresh(rol)
    return rol


# ---------------------------------------------------------
# ELIMINAR ROL
# ---------------------------------------------------------
def eliminar_rol(db: Session, rol_id: int):
    rol = obtener_rol(db, rol_id)
    if not rol:
        return False

    db.delete(rol)
    db.commit()
    return True
