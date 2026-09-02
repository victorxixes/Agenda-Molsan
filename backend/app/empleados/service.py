from sqlalchemy.orm import Session
import hashlib

from app.empleados.models import Empleado
from app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
from app.auth.service import crear_token, serializar_empleado


# ---------------------------------------------------------
# HASH SEGURO
# ---------------------------------------------------------
def hash_password(password: str) -> str:
    if not password:
        return ""
    return hashlib.sha256(password.encode()).hexdigest()


# ---------------------------------------------------------
# LOGIN EMPLEADO
# ---------------------------------------------------------
def login_empleado(db: Session, usuario: str, password: str):
    empleado = db.query(Empleado).filter(Empleado.usuario == usuario).first()
    if not empleado:
        return None
    if not empleado.password:
        return None
    if empleado.password != hash_password(password):
        return None

    return {
        "token": crear_token(empleado),
        "empleado": serializar_empleado(empleado)
    }


# ---------------------------------------------------------
# OBTENER EMPLEADO POR ID
# ---------------------------------------------------------
def obtener_empleado(db: Session, empleado_id: int):
    return db.query(Empleado).filter(Empleado.id == empleado_id).first()


# ---------------------------------------------------------
# OBTENER EMPLEADO POR USUARIO
# ---------------------------------------------------------
def obtener_empleado_por_usuario(db: Session, usuario: str):
    return db.query(Empleado).filter(Empleado.usuario == usuario).first()


# ---------------------------------------------------------
# CREAR EMPLEADO
# ---------------------------------------------------------
def crear_empleado(db: Session, data: EmpleadoCreate):

    # Evitar FK rotas
    for campo in ["departamento_id", "seccion_id", "cargo_id", "rol_id"]:
        if getattr(data, campo) == 0:
            setattr(data, campo, None)

    # Validación de usuario duplicado
    if obtener_empleado_por_usuario(db, data.usuario):
        raise ValueError("El usuario ya existe")

    empleado = Empleado(
        nombre=data.nombre,
        apellidos=data.apellidos,
        dni=data.dni,
        telefono=data.telefono,
        email_personal=data.email_personal,
        email_empresa=data.email_empresa,
        extension=data.extension,
        usuario=data.usuario,
        password=hash_password(data.password),

        direccion=data.direccion,
        fecha_nacimiento=data.fecha_nacimiento,
        alergias=data.alergias,
        persona_contacto=data.persona_contacto,
        telefono_contacto=data.telefono_contacto,
        observaciones=data.observaciones,
        foto=data.foto,

        departamento_id=data.departamento_id,
        seccion_id=data.seccion_id,
        cargo_id=data.cargo_id,
        rol_id=data.rol_id,

        fecha_alta=data.fecha_alta,
        fecha_baja=data.fecha_baja,
        activo=data.activo,

        modulos_visibles_list=data.modulos_visibles_list or [],
        permisos_modulo_dict=data.permisos_modulo_dict or {},
    )

    db.add(empleado)
    db.commit()
    db.refresh(empleado)
    return empleado


# ---------------------------------------------------------
# LISTAR EMPLEADOS
# ---------------------------------------------------------
def listar_empleados(db: Session):
    return db.query(Empleado).order_by(Empleado.id.asc()).all()


# ---------------------------------------------------------
# EDITAR EMPLEADO
# ---------------------------------------------------------
def editar_empleado(db: Session, empleado_id: int, data: EmpleadoUpdate):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    # Evitar FK rotas
    for campo in ["departamento_id", "seccion_id", "cargo_id", "rol_id"]:
        if getattr(data, campo) == 0:
            setattr(data, campo, None)

    # Actualizar campos normales
    for campo, valor in data.dict(exclude_unset=True).items():
        if campo in ["modulos_visibles_list", "permisos_modulo_dict", "password"]:
            continue
        setattr(empleado, campo, valor)

    # Actualizar contraseña
    if data.password:
        empleado.password = hash_password(data.password)

    # Actualizar módulos visibles
    if data.modulos_visibles_list is not None:
        empleado.modulos_visibles_list = data.modulos_visibles_list

    # Actualizar permisos del empleado
    if data.permisos_modulo_dict is not None:
        empleado.permisos_modulo_dict = data.permisos_modulo_dict

    db.commit()
    db.refresh(empleado)
    return empleado


# ---------------------------------------------------------
# ELIMINAR EMPLEADO
# ---------------------------------------------------------
def eliminar_empleado(db: Session, empleado_id: int):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return False

    db.delete(empleado)
    db.commit()
    return True
