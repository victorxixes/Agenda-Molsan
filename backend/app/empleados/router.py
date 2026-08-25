from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
import os
import json

from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from backend.app.roles.models import Rol

from backend.app.empleados.schemas import (
    EmpleadoCreate,
    EmpleadoUpdate,
    EmpleadoResponse,
    EmpleadoSearchResponse
)

from backend.app.empleados.service import (
    crear_empleado,
    editar_empleado as editar_empleado_service,
    eliminar_empleado,
    listar_empleados
)

router = APIRouter(prefix="/empleados", tags=["Empleados"])


# ---------------------------------------------------------
# UTILIDAD: SANEAR JSONB + ROL
# ---------------------------------------------------------
def _sanear_jsonb_empleado(e: Empleado):
    # relaciones fuera
    e.departamento = None
    e.seccion = None
    e.cargo = None

    # rol
    if e.rol_id:
        rol = e.rol if hasattr(e, "rol") else None
        e.rol_nombre = rol.nombre if rol else None
    else:
        e.rol_nombre = None

    # modulos_visibles siempre lista
    mv = e.modulos_visibles
    if isinstance(mv, str):
        mv = mv.split(",")
    elif mv is None:
        mv = []
    e.modulos_visibles = mv

    # permisos_modulo siempre dict
    pm = e.permisos_modulo
    if isinstance(pm, str):
        try:
            pm = json.loads(pm)
        except Exception:
            pm = {}
    elif pm is None:
        pm = {}
    e.permisos_modulo = pm

    return e


# ---------------------------------------------------------
# LISTAR
# ---------------------------------------------------------
@router.get("", response_model=list[EmpleadoResponse])
def listar(db: Session = Depends(get_db)):
    empleados = listar_empleados(db)
    return [_sanear_jsonb_empleado(e) for e in empleados]


# ---------------------------------------------------------
# OBTENER UNO
# ---------------------------------------------------------
@router.get("/{empleado_id}", response_model=EmpleadoResponse)
def obtener(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# CREAR
# ---------------------------------------------------------
@router.post("/", response_model=EmpleadoResponse)
def crear(data: EmpleadoCreate, db: Session = Depends(get_db)):

    # validar rol
    if data.rol_id:
        rol = db.query(Rol).filter(Rol.id == data.rol_id).first()
        if not rol:
            raise HTTPException(status_code=400, detail="Rol no válido")

    empleado = crear_empleado(db, data)
    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# EDITAR
# ---------------------------------------------------------
@router.put("/{empleado_id}", response_model=EmpleadoResponse)
def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):

    # validar rol
    if data.rol_id:
        rol = db.query(Rol).filter(Rol.id == data.rol_id).first()
        if not rol:
            raise HTTPException(status_code=400, detail="Rol no válido")

    empleado = editar_empleado_service(db, empleado_id, data)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# ACTUALIZAR MÓDULOS
# ---------------------------------------------------------
@router.put("/{empleado_id}/modulos")
def actualizar_modulos(empleado_id: int, data: dict, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    modulos = data.get("modulos")
    if not isinstance(modulos, list):
        raise HTTPException(status_code=400, detail="Formato de módulos inválido")

    empleado.modulos_visibles = modulos

    db.commit()
    db.refresh(empleado)

    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# ACTUALIZAR PERMISOS
# ---------------------------------------------------------
@router.put("/{empleado_id}/permisos")
def actualizar_permisos(empleado_id: int, data: dict, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    permisos = data.get("permisos")
    if not isinstance(permisos, dict):
        raise HTTPException(status_code=400, detail="Formato de permisos inválido")

    empleado.permisos_modulo = permisos

    db.commit()
    db.refresh(empleado)

    return _sanear_jsonb_empleado(empleado)
