from sqlalchemy.orm import Session
from app.empleados.models import Empleado
from app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
import hashlib

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def crear_empleado(db: Session, data: EmpleadoCreate):
    empleado = Empleado(
        nombre=data.nombre,
        dni=data.dni,
        usuario=data.dni,
        password=hash_password(data.dni),
        apellidos=None,
        modulos_visibles=[],
        permisos_modulo={},
        activo=True
    )

    db.add(empleado)
    db.commit()
    db.refresh(empleado)
    return empleado

def editar_empleado(db: Session, empleado_id: int, data: EmpleadoUpdate):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    for campo, valor in data.dict(exclude_unset=True).items():
        if campo == "password":
            valor = hash_password(valor)
        setattr(empleado, campo, valor)

    db.commit()
    db.refresh(empleado)
    return empleado

def eliminar_empleado(db: Session, empleado_id: int):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    db.delete(empleado)
    db.commit()
    return True
