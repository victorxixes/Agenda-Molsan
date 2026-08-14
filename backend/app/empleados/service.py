from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException
import hashlib
import json
import jwt

from backend.app.empleados.models import Empleado
from backend.app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
from backend.app.config import SECRET_KEY  # ajusta el import según dónde tengas tu clave


# ---------------------------------------------------------
# UTILIDADES
# ---------------------------------------------------------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# ---------------------------------------------------------
# LOGIN EMPLEADO
# ---------------------------------------------------------
def login(db: Session, usuario: str, password: str):
    empleado = (
        db.query(Empleado)
        .filter(
            or_(
                Empleado.usuario == usuario,
                Empleado.dni == usuario
            )
        )
        .first()
    )

    if not empleado:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    # --- Validar activo ---
    if not empleado.activo:
        raise HTTPException(status_code=401, detail="Usuario inactivo")

    # --- Validar contraseña ---
    password_hash = hash_password(password)

    if empleado.password != password_hash:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    # --- Validar módulos ---
    if not empleado.modulos_visibles or len(empleado.modulos_visibles) == 0:
        raise HTTPException(status_code=401, detail="Usuario sin módulos asignados")

    # --- Validar permisos ---
    if not empleado.permisos_modulo or len(empleado.permisos_modulo.keys()) == 0:
        raise HTTPException(status_code=401, detail="Usuario sin permisos asignados")

    # --- Validar estructura mínima ---
    if not empleado.departamento_id or not empleado.seccion_id or not empleado.cargo_id:
        raise HTTPException(status_code=401, detail="Usuario sin estructura asignada")

    # --- Generar token ---
    token = jwt.encode(
        {
            "id": empleado.id,
            "usuario": empleado.usuario,
            "rol": empleado.cargo_id
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return {
        "token": token,
        "empleado": empleado
    }


# ---------------------------------------------------------
# CREAR EMPLEADO (V2)
# ---------------------------------------------------------
def crear_empleado(db: Session, data: EmpleadoCreate):
    # --- Validar DNI duplicado ---
    if db.query(Empleado).filter(Empleado.dni == data.dni).first():
        raise HTTPException(status_code=400, detail="El DNI ya existe")

    # --- Contraseña por defecto segura ---
    password_plano = data.password if getattr(data, "password", None) else data.dni
    password_hash = hash_password(password_plano)

    # --- Módulos por defecto ---
    modulos_defecto = [
        "dashboard",
        "empleados",
        "documentos",
        "mensajes",
        "agenda",
        "ctn",
        "intranet",
        "seguridad"
    ]

    # --- Permisos por defecto ---
    permisos_defecto = {
        "dashboard": ["ver"],
        "empleados": ["ver"],
        "agenda": ["ver"],
        "documentos": ["ver"],
        "mensajes": ["ver"],
        "ctn": ["ver"],
        "intranet": ["ver"],
        "seguridad": ["ver"]
    }

    empleado = Empleado(
        nombre=data.nombre,
        apellidos=data.apellidos,
        dni=data.dni,
        usuario=data.usuario if getattr(data, "usuario", None) else data.dni,
        password=password_hash,
        telefono=getattr(data, "telefono", None),
        email_personal=getattr(data, "email_personal", None),
        direccion=getattr(data, "direccion", None),
        fecha_nacimiento=getattr(data, "fecha_nacimiento", None),
        alergias=getattr(data, "alergias", None),
        persona_contacto=getattr(data, "persona_contacto", None),
        telefono_contacto=getattr(data, "telefono_contacto", None),
        observaciones=getattr(data, "observaciones", None),
        departamento_id=getattr(data, "departamento_id", None),
        seccion_id=getattr(data, "seccion_id", None),
        cargo_id=getattr(data, "cargo_id", None),
        email_empresa=getattr(data, "email_empresa", None),
        extension=getattr(data, "extension", None),
        fecha_alta=getattr(data, "fecha_alta", None),
        fecha_baja=getattr(data, "fecha_baja", None),
        activo=True,
        foto="/static/fotos_empleados/default.jpg",
        modulos_visibles=modulos_defecto,
        permisos_modulo=permisos_defecto
    )

    db.add(empleado)
    db.commit()
    db.refresh(empleado)
    return empleado


# ---------------------------------------------------------
# EDITAR EMPLEADO (V2)
# ---------------------------------------------------------
def editar_empleado(db: Session, empleado_id: int, data: EmpleadoUpdate):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    datos = data.dict(exclude_unset=True)

    for campo, valor in datos.items():

        # --- PASSWORD (manejo seguro) ---
        if campo == "password":
            # Si viene vacío o None → NO tocar la contraseña
            if valor is None or valor == "":
                continue

            # Si viene ya hasheada (64 chars hex) → NO re-hashear
            if isinstance(valor, str) and len(valor) == 64 and all(
                c in "0123456789abcdef" for c in valor.lower()
            ):
                continue

            # Si viene en texto plano → hashearla
            valor = hash_password(valor)

        # --- JSONB: modulos_visibles ---
        if campo == "modulos_visibles":
            if valor is None:
                valor = []
            elif not isinstance(valor, list):
                try:
                    valor = json.loads(valor)
                except Exception:
                    valor = []

        # --- JSONB: permisos_modulo ---
        if campo == "permisos_modulo":
            if valor is None:
                valor = {}
            elif not isinstance(valor, dict):
                try:
                    valor = json.loads(valor)
                except Exception:
                    valor = {}

        # --- Campos vacíos deben convertirse en None ---
        if isinstance(valor, str) and valor.strip() == "":
            valor = None

        # --- Asignar solo si el campo existe en el modelo ---
        if hasattr(Empleado, campo):
            setattr(empleado, campo, valor)

    db.commit()
    db.refresh(empleado)
    return empleado


# ---------------------------------------------------------
# ELIMINAR EMPLEADO (V2)
# ---------------------------------------------------------
def eliminar_empleado(db: Session, empleado_id: int):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    db.delete(empleado)
    db.commit()
    return True


# ---------------------------------------------------------
# LISTAR EMPLEADOS (V2)
# ---------------------------------------------------------
def listar_empleados(db: Session):
    return db.query(Empleado).all()
