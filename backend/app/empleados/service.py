from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException
import hashlib
import json
import jwt
from datetime import datetime

from backend.app.empleados.models import Empleado
from backend.app.seguridad.models import Rol
from backend.app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
from backend.app.config import settings

# 🔥 Importar broadcast realtime
from backend.app.websockets.empleados_ws import broadcast_empleados


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def login(db: Session, usuario: str, password: str):
    empleado = db.query(Empleado).filter(
        or_(Empleado.usuario == usuario, Empleado.dni == usuario)
    ).first()

    if not empleado:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    if not empleado.activo:
        raise HTTPException(status_code=401, detail="Usuario inactivo")

    if empleado.password != hash_password(password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    token = jwt.encode(
        {
            "id": empleado.id,
            "usuario": empleado.usuario,
            "rol_id": empleado.rol_id,
            "rol_nombre": empleado.rol.nombre if empleado.rol else None,
        },
        settings.JWT_SECRET,
        algorithm=settings.ALGORITHM,
    )

    return {
        "token": token,
        "empleado": empleado,
    }


# ---------------------------------------------------------
# CREAR EMPLEADO
# ---------------------------------------------------------
def crear_empleado(db: Session, data: EmpleadoCreate):

    if db.query(Empleado).filter(Empleado.dni == data.dni).first():
        raise HTTPException(status_code=400, detail="El DNI ya existe")

    if data.rol_id:
        if not db.query(Rol).filter(Rol.id == data.rol_id).first():
            raise HTTPException(status_code=400, detail="Rol no válido")

    password_plano = data.password if data.password else data.dni
    password_hash = hash_password(password_plano)

    empleado = Empleado(
        nombre=data.nombre,
        apellidos=data.apellidos,
        dni=data.dni,
        usuario=data.usuario if data.usuario else data.dni,
        password=password_hash,
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
        activo=True,
        foto="/static/fotos_empleados/default.jpg",
        rol_id=data.rol_id,
        modulos_visibles=data.modulos_visibles,
        permisos_modulo=data.permisos_modulo,
    )

    db.add(empleado)
    db.commit()
    db.refresh(empleado)

    # 🔥 Evento realtime
    broadcast_empleados({
        "tipo": "empleado_creado",
        "descripcion": f"Empleado creado: {empleado.nombre}",
        "fecha": datetime.now().isoformat(),
        "payload": empleado.to_dict() if hasattr(empleado, "to_dict") else empleado.__dict__
    })

    return empleado
# ---------------------------------------------------------
#  EMPLEADO EXISTENTE
# ---------------------------------------------------------
def empleado_existe(db, usuario_id: int) -> bool:
    return db.query(Empleado).filter(Empleado.id == usuario_id).first() is not None

# ---------------------------------------------------------
# EDITAR EMPLEADO
# ---------------------------------------------------------
def editar_empleado(db: Session, empleado_id: int, data: EmpleadoUpdate):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    if data.rol_id:
        if not db.query(Rol).filter(Rol.id == data.rol_id).first():
            raise HTTPException(status_code=400, detail="Rol no válido")

    datos = data.dict(exclude_unset=True)

    for campo, valor in datos.items():

        if campo == "password":
            if valor:
                valor = hash_password(valor)

        if campo == "modulos_visibles" and isinstance(valor, str):
            valor = valor.split(",")

        if campo == "permisos_modulo" and isinstance(valor, str):
            valor = json.loads(valor)

        setattr(empleado, campo, valor)

    db.commit()
    db.refresh(empleado)

    # 🔥 Evento realtime
    broadcast_empleados({
        "tipo": "empleado_actualizado",
        "descripcion": f"Empleado actualizado: {empleado.nombre}",
        "fecha": datetime.now().isoformat(),
        "payload": empleado.to_dict() if hasattr(empleado, "to_dict") else empleado.__dict__
    })

    return empleado


# ---------------------------------------------------------
# ELIMINAR EMPLEADO
# ---------------------------------------------------------
def eliminar_empleado(db: Session, empleado_id: int):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    db.delete(empleado)
    db.commit()

    # 🔥 Evento realtime
    broadcast_empleados({
        "tipo": "empleado_eliminado",
        "descripcion": f"Empleado eliminado: ID {empleado_id}",
        "fecha": datetime.now().isoformat(),
        "payload": {"id": empleado_id}
    })

    return True


# ---------------------------------------------------------
# LISTAR EMPLEADOS
# ---------------------------------------------------------
def listar_empleados(db: Session):
    return db.query(Empleado).all()
