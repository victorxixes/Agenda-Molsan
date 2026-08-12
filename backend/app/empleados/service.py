from sqlalchemy.orm import Session
from app.empleados.models import Empleado
from app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
import hashlib
import json

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

# ---------------------------------------------------------
# CREAR EMPLEADO (V2)
# ---------------------------------------------------------
def crear_empleado(db: Session, data: EmpleadoCreate):
    empleado = Empleado(
        nombre=data.nombre,
        dni=data.dni,
        usuario=data.dni,
        password=hash_password(data.dni),
        activo=True
    )

    db.add(empleado)
    db.commit()
    db.refresh(empleado)
    return empleado

# ---------------------------------------------------------
# EDITAR EMPLEADO (V2) — FIX COMPLETO
# ---------------------------------------------------------
def editar_empleado(db: Session, empleado_id: int, data: EmpleadoUpdate):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    datos = data.dict(exclude_unset=True)

    for campo, valor in datos.items():

        # --- PASSWORD ---
        if campo == "password" and valor:
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
