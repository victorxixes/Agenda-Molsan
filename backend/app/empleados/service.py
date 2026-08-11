from sqlalchemy.orm import Session
from app.empleados.models import Empleado
from app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
import hashlib

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def crear_empleado(db: Session, data: EmpleadoCreate):
    empleado = Empleado(
        nombre=data.nombre,
        apellidos=data.apellidos,
        dni=data.dni,
        telefono=data.telefono,
        email_personal=data.email_personal,
        direccion=data.direccion,
        fecha_nacimiento=data.fecha_nacimiento,
        departamento_id=data.departamento_id,
        seccion_id=data.seccion_id,
        cargo_id=data.cargo_id,
        email_empresa=data.email_empresa,
        extension=data.extension,
        fecha_alta=data.fecha_alta,
        fecha_baja=data.fecha_baja,
        alergias=data.alergias,
        persona_contacto=data.persona_contacto,
        telefono_contacto=data.telefono_contacto,
        observaciones=data.observaciones,
        usuario=data.usuario,
        password=hash_password(data.password),
        modulos_visibles=data.modulos_visibles,
        permisos_modulo=data.permisos_modulo,
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
