from sqlalchemy.orm import Session
import hashlib

from app.empleados.models import Empleado
from app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
from app.auth.service import crear_token, serializar_empleado


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def login_empleado(db: Session, usuario: str, password: str):
    empleado = db.query(Empleado).filter(Empleado.usuario == usuario).first()
    if not empleado:
        return None
    if empleado.password != hash_password(password):
        return None

    return {
        "token": crear_token(empleado),
        "empleado": serializar_empleado(empleado)
    }


def obtener_empleado(db: Session, empleado_id: int):
    return db.query(Empleado).filter(Empleado.id == empleado_id).first()


def obtener_empleado_por_usuario(db: Session, usuario: str):
    return db.query(Empleado).filter(Empleado.usuario == usuario).first()


def crear_empleado(db: Session, data: EmpleadoCreate):

    if obtener_empleado_por_usuario(db, data.usuario):
        raise ValueError("El usuario ya existe")

    empleado = Empleado(
        nombre=data.nombre,
        dni=data.dni,
        usuario=data.usuario,
        password=hash_password(data.password),
        activo=True,
        modulos_visibles_list=[],
        permisos_modulo_dict={}
    )

    db.add(empleado)
    db.commit()
    db.refresh(empleado)
    return empleado


def listar_empleados(db: Session):
    return db.query(Empleado).order_by(Empleado.id.asc()).all()


def editar_empleado(db: Session, empleado_id: int, data: EmpleadoUpdate):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return None

    for campo, valor in data.dict(exclude_unset=True).items():
        if campo == "password":
            empleado.password = hash_password(valor)
        else:
            setattr(empleado, campo, valor)

    db.commit()
    db.refresh(empleado)
    return empleado


def eliminar_empleado(db: Session, empleado_id: int):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return False

    db.delete(empleado)
    db.commit()
    return True

