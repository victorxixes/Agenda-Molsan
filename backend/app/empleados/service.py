import hashlib
from sqlalchemy.orm import Session
import json
import os
from datetime import datetime

from app.empleados.models import Empleado
from app.auditoria.models import Auditoria

BACKEND_URL = "https://https://agenda-intranet-b.onrender.com"


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


def build_foto_url(empleado):
    if empleado.foto:
        return f"{BACKEND_URL}/static/fotos/empleado_{empleado.id}.jpg"
    return f"{BACKEND_URL}/static/avatar.png"


# ---------------------------------------------------------
# CRUD BÁSICO
# ---------------------------------------------------------

def obtener_empleado(db: Session, empleado_id: int):
    return db.query(Empleado).filter(Empleado.id == empleado_id).first()


def eliminar_empleado(db: Session, empleado_id: int):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return {"error": "Empleado no encontrado"}

    db.delete(empleado)
    db.commit()
    return {"status": "ok"}


def inhabilitar_empleado(db: Session, empleado_id: int):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return {"error": "Empleado no encontrado"}

    empleado.activo = False
    db.commit()
    return {"status": "ok"}


def habilitar_empleado(db: Session, empleado_id: int):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return {"error": "Empleado no encontrado"}

    empleado.activo = True
    db.commit()
    return {"status": "ok"}


def resetear_password(db: Session, empleado_id: int, nueva_password: str):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return {"error": "Empleado no encontrado"}

    empleado.password = hash_password(nueva_password)
    db.commit()
    return {"status": "ok"}


def actualizar_modulos_visibles(db: Session, empleado_id: int, modulos: list[str]):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return {"error": "Empleado no encontrado"}

    empleado.modulos_visibles = modulos
    db.commit()
    return {"status": "ok"}


def actualizar_permisos_modulo(db: Session, empleado_id: int, permisos: dict):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return {"error": "Empleado no encontrado"}

    empleado.permisos_modulo = permisos
    db.commit()
    return {"status": "ok"}


# ---------------------------------------------------------
# LISTAR
# ---------------------------------------------------------

def listar_empleados(db: Session):
    empleados = db.query(Empleado).all()
    resultado = []

    for emp in empleados:
        resultado.append({
            "id": emp.id,
            "nombre": emp.nombre,
            "apellidos": emp.apellidos,
            "dni": emp.dni,
            "telefono": emp.telefono,
            "email_personal": emp.email_personal,
            "direccion": emp.direccion,
            "fecha_nacimiento": emp.fecha_nacimiento,
            "departamento_id": emp.departamento_id,
            "seccion_id": emp.seccion_id,
            "cargo_id": emp.cargo_id,
            "email_empresa": emp.email_empresa,
            "extension": emp.extension,
            "fecha_alta": emp.fecha_alta,
            "fecha_baja": emp.fecha_baja,
            "alergias": emp.alergias,
            "persona_contacto": emp.persona_contacto,
            "telefono_contacto": emp.telefono_contacto,
            "observaciones": emp.observaciones,
            "modulos_visibles": emp.modulos_visibles or [],
            "permisos_modulo": emp.permisos_modulo or {},
            "activo": emp.activo,
            "foto_url": build_foto_url(emp)
        })

    return resultado


# ---------------------------------------------------------
# CREAR / EDITAR COMPLETO
# ---------------------------------------------------------

async def crear_empleado_completo(db: Session, data_json: str, foto):
    data = json.loads(data_json)

    empleado = Empleado(
        nombre=data.get("nombre"),
        apellidos=data.get("apellidos"),
        dni=data.get("dni"),
        telefono=data.get("telefono"),
        email_personal=data.get("email_personal"),
        direccion=data.get("direccion"),
        fecha_nacimiento=data.get("fecha_nacimiento"),
        departamento_id=data.get("departamento_id"),
        seccion_id=data.get("seccion_id"),
        cargo_id=data.get("cargo_id"),
        email_empresa=data.get("email_empresa"),
        extension=data.get("extension"),
        fecha_alta=data.get("fecha_alta"),
        fecha_baja=data.get("fecha_baja"),
        alergias=data.get("alergias"),
        persona_contacto=data.get("persona_contacto"),
        telefono_contacto=data.get("telefono_contacto"),
        observaciones=data.get("observaciones"),
        usuario=data.get("dni"),
        password=hash_password(data.get("password", "1234")),
        modulos_visibles=data.get("modulos_visibles", []),
        permisos_modulo=data.get("permisos_modulo", {})
    )

    db.add(empleado)
    db.commit()
    db.refresh(empleado)

    if foto:
        carpeta = "static/fotos"
        os.makedirs(carpeta, exist_ok=True)
        ruta = f"{carpeta}/empleado_{empleado.id}.jpg"
        contenido = await foto.read()
        with open(ruta, "wb") as f:
            f.write(contenido)
        empleado.foto = ruta
        db.commit()

    log = Auditoria(
        usuario=empleado.dni,
        accion="CREACIÓN COMPLETA",
        modulo="empleados",
        descripcion="Empleado creado desde utilidades",
        fecha=datetime.now(),
        ip="0.0.0.0"
    )
    db.add(log)
    db.commit()

    return {"status": "ok", "empleado_id": empleado.id}


async def editar_empleado_completo(db: Session, empleado_id: int, data_json: str, foto):
    data = json.loads(data_json)
    empleado = obtener_empleado(db, empleado_id)

    if not empleado:
        return {"error": "Empleado no encontrado"}

    campos_validos = [
        "nombre", "apellidos", "dni", "telefono", "email_personal", "direccion",
        "fecha_nacimiento", "departamento_id", "seccion_id", "cargo_id",
        "email_empresa", "extension", "fecha_alta", "fecha_baja", "alergias",
        "persona_contacto", "telefono_contacto", "observaciones",
        "modulos_visibles", "permisos_modulo"
    ]

    for campo in campos_validos:
        if campo in data:
            setattr(empleado, campo, data[campo])

    if foto:
        carpeta = "static/fotos"
        os.makedirs(carpeta, exist_ok=True)
        ruta = f"{carpeta}/empleado_{empleado.id}.jpg"
        contenido = await foto.read()
        with open(ruta, "wb") as f:
            f.write(contenido)
        empleado.foto = ruta

    db.commit()
    db.refresh(empleado)

    log = Auditoria(
        usuario=empleado.dni,
        accion="EDICIÓN COMPLETA",
        modulo="empleados",
        descripcion="Empleado editado desde utilidades",
        fecha=datetime.now(),
        ip="0.0.0.0"
    )
    db.add(log)
    db.commit()

    return {"status": "ok", "empleado_id": empleado.id}
