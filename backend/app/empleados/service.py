from sqlalchemy.orm import Session

from backend.app.empleados.models import Empleado
from backend.app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate

import hashlib
import json


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


# ---------------------------------------------------------
# CREAR EMPLEADO (V2)
# ---------------------------------------------------------
def crear_empleado(db: Session, data: EmpleadoCreate):
    # --- Validar DNI duplicado ---
    if db.query(Empleado).filter(Empleado.dni == data.dni).first():
        raise HTTPException(status_code=400, detail="El DNI ya existe")

    # --- Contraseña por defecto segura ---
    password_plano = data.password if data.password else data.dni
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
            if len(valor) == 64 and all(c in "0123456789abcdef" for c in valor.lower()):
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
                except:
                    valor = []

        # --- JSONB: permisos_modulo ---
        if campo == "permisos_modulo":
            if valor is None:
                valor = {}
            elif not isinstance(valor, dict):
                try:
                    valor = json.loads(valor)
                except:
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
