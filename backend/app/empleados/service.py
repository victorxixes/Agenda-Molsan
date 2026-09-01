from sqlalchemy.orm import Session
import hashlib

from backend.app.empleados.models import Empleado
from backend.app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
from backend.app.auth.service import crear_token, serializar_empleado

def hash_password(password: str) -> str:
    if not password:
        return ""
    return hashlib.sha256(password.encode()).hexdigest()

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

def crear_empleado(db: Session, data: EmpleadoCreate):

    # Evitar FK rotas
    for campo in ["departamento_id", "seccion_id", "cargo_id", "rol_id"]:
        if getattr(data, campo) == 0:
            setattr(data, campo, None)

    empleado = Empleado(
        nombre=data.nombre,
        apellidos=data.apellidos,
        dni=data.dni,
        telefono=data.telefono,
        email_personal=data.email_personal,
        direccion=data.direccion,
        fecha_nacimiento=data.fecha_nacimiento,
        alergias=data.alergias,
        persona_contacto=data.persona_contacto,
        telefono_contacto=data.telefono_contacto,
        observaciones=data.observaciones,
        departamento_id=data.departamento_id,
        seccion_id=data.seccion_id,
        cargo_id=data.cargo_id,
        email_empresa=data.email_empresa,
        extension=data.extension,
        fecha_alta=data.fecha_alta,
        fecha_baja=data.fecha_baja,
        activo=data.activo,
        usuario=data.usuario,
        password=hash_password(data.password),
        foto=data.foto,
        rol_id=data.rol_id,
        modulos_visibles_list=data.modulos_visibles_list or [],
        permisos_modulo_dict=data.permisos_modulo_dict or {},
    )

    db.add(empleado)
    db.commit()
    db.refresh(empleado)
    return empleado

def editar_empleado(db: Session, empleado_id: int, data: EmpleadoUpdate):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    for campo in ["departamento_id", "seccion_id", "cargo_id", "rol_id"]:
        if getattr(data, campo) == 0:
            setattr(data, campo, None)

    for campo, valor in data.dict(exclude_unset=True).items():
        if campo in ["modulos_visibles_list", "permisos_modulo_dict", "password"]:
            continue
        setattr(empleado, campo, valor)

    if data.password:
        empleado.password = hash_password(data.password)

    if data.modulos_visibles_list is not None:
        empleado.modulos_visibles_list = data.modulos_visibles_list

    if data.permisos_modulo_dict is not None:
        empleado.permisos_modulo_dict = data.permisos_modulo_dict

    db.commit()
    db.refresh(empleado)
    return empleado
