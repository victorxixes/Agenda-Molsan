from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import json
import asyncio
from datetime import datetime

from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from backend.app.seguridad.models import Rol

from backend.app.empleados.schemas import (
    EmpleadoCreate,
    EmpleadoUpdate,
    EmpleadoResponse,
)

from backend.app.empleados.service import (
    crear_empleado,
    editar_empleado as editar_empleado_service,
    eliminar_empleado,
    listar_empleados,
)

from backend.app.websockets.empleados_ws import broadcast_empleados

router = APIRouter(prefix="/empleados", tags=["Empleados"])


# ---------------------------------------------------------
# FIX: AÑADIR COLUMNAS FALTANTES A LA TABLA EMPLEADOS
# ---------------------------------------------------------
@router.get("/fix-columns")
async def fix_columns(db: Session = Depends(get_db)):
    try:
        db.execute("""
            ALTER TABLE empleados 
            ADD COLUMN IF NOT EXISTS modulos_visibles_list JSONB DEFAULT '[]';
        """)
        db.execute("""
            ALTER TABLE empleados 
            ADD COLUMN IF NOT EXISTS permisos_modulo_dict JSONB DEFAULT '{}';
        """)
        db.commit()
        return {"status": "ok", "detail": "Columnas añadidas correctamente"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


# ---------------------------------------------------------
# SANEAR JSONB / CAMPOS JSON
# ---------------------------------------------------------
def _sanear_jsonb_empleado(e: Empleado):
    # Evitar recursión en relaciones
    e.departamento = None
    e.seccion = None
    e.cargo = None

    # Rol nombre
    e.rol_nombre = e.rol.nombre if e.rol else None

    # modulos_visibles_list
    mv = e.modulos_visibles_list
    if isinstance(mv, str):
        try:
            mv = json.loads(mv)
        except Exception:
            mv = []
    elif mv is None:
        mv = []
    e.modulos_visibles_list = mv

    # permisos_modulo_dict
    pm = e.permisos_modulo_dict
    if isinstance(pm, str):
        try:
            pm = json.loads(pm)
        except Exception:
            pm = {}
    elif pm is None:
        pm = {}
    e.permisos_modulo_dict = pm

    return e


# ---------------------------------------------------------
# LISTAR
# ---------------------------------------------------------
@router.get("", response_model=list[EmpleadoResponse])
async def listar(db: Session = Depends(get_db)):
    empleados = listar_empleados(db)
    return [_sanear_jsonb_empleado(e) for e in empleados]


# ---------------------------------------------------------
# OBTENER
# ---------------------------------------------------------
@router.get("/{empleado_id}", response_model=EmpleadoResponse)
async def obtener(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# CREAR
# ---------------------------------------------------------
@router.post("/", response_model=EmpleadoResponse)
async def crear(data: EmpleadoCreate, db: Session = Depends(get_db)):

    if data.rol_id:
        if not db.query(Rol).filter(Rol.id == data.rol_id).first():
            raise HTTPException(status_code=400, detail="Rol no válido")

    empleado = crear_empleado(db, data)
    empleado = _sanear_jsonb_empleado(empleado)

    loop = asyncio.get_running_loop()
    loop.create_task(broadcast_empleados({
        "tipo": "empleado_creado",
        "descripcion": f"Empleado creado: {empleado.nombre}",
        "fecha": datetime.now().isoformat(),
        "payload": empleado.__dict__,
    }))

    return empleado


# ---------------------------------------------------------
# EDITAR
# ---------------------------------------------------------
@router.put("/{empleado_id}", response_model=EmpleadoResponse)
async def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):

    if data.rol_id:
        if not db.query(Rol).filter(Rol.id == data.rol_id).first():
            raise HTTPException(status_code=400, detail="Rol no válido")

    empleado = editar_empleado_service(db, empleado_id, data)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado = _sanear_jsonb_empleado(empleado)

    loop = asyncio.get_running_loop()
    loop.create_task(broadcast_empleados({
        "tipo": "empleado_actualizado",
        "descripcion": f"Empleado actualizado: {empleado.nombre}",
        "fecha": datetime.now().isoformat(),
        "payload": empleado.__dict__,
    }))

    return empleado


# ---------------------------------------------------------
# ELIMINAR
# ---------------------------------------------------------
@router.delete("/{empleado_id}")
async def eliminar(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    db.delete(empleado)
    db.commit()

    loop = asyncio.get_running_loop()
    loop.create_task(broadcast_empleados({
        "tipo": "empleado_eliminado",
        "descripcion": f"Empleado eliminado: ID {empleado_id}",
        "fecha": datetime.now().isoformat(),
        "payload": {"id": empleado_id},
    }))

    return {"detail": "Empleado eliminado correctamente"}


# ---------------------------------------------------------
# CAMBIAR ESTADO
# ---------------------------------------------------------
@router.put("/{empleado_id}/estado")
async def cambiar_estado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado.activo = not empleado.activo
    db.commit()
    db.refresh(empleado)

    empleado = _sanear_jsonb_empleado(empleado)

    loop = asyncio.get_running_loop()
    loop.create_task(broadcast_empleados({
        "tipo": "empleado_estado_cambiado",
        "descripcion": f"Estado cambiado: {empleado.nombre}",
        "fecha": datetime.now().isoformat(),
        "payload": empleado.__dict__,
    }))

    return empleado


# ---------------------------------------------------------
# CAMBIAR ROL
# ---------------------------------------------------------
@router.put("/{empleado_id}/rol/{rol_id}")
async def cambiar_rol(empleado_id: int, rol_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    rol = db.query(Rol).filter(Rol.id == rol_id).first()
    if not rol:
        raise HTTPException(status_code=400, detail="Rol no válido")

    empleado.rol_id = rol_id
    db.commit()
    db.refresh(empleado)

    empleado = _sanear_jsonb_empleado(empleado)

    loop = asyncio.get_running_loop()
    loop.create_task(broadcast_empleados({
        "tipo": "empleado_rol_cambiado",
        "descripcion": f"Rol cambiado: {empleado.nombre}",
        "fecha": datetime.now().isoformat(),
        "payload": empleado.__dict__,
    }))

    return empleado


# ---------------------------------------------------------
# SUBIR FOTO
# ---------------------------------------------------------
@router.post("/{id}/foto")
async def subir_foto(id: int, archivo: UploadFile = File(...), db: Session = Depends(get_db)):
    filename = f"empleado_{id}.jpg"
    path = f"/tmp/{filename}"

    with open(path, "wb") as f:
        f.write(await archivo.read())

    empleado = db.query(Empleado).filter(Empleado.id == id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado.foto = filename
    db.commit()
    db.refresh(empleado)

    return {"foto": filename}


# ---------------------------------------------------------
# ACTUALIZAR MÓDULOS
# ---------------------------------------------------------
@router.put("/{empleado_id}/modulos")
async def actualizar_modulos(empleado_id: int, modulos: list[str], db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado.modulos_visibles_list = modulos
    db.commit()
    db.refresh(empleado)

    empleado = _sanear_jsonb_empleado(empleado)

    loop = asyncio.get_running_loop()
    loop.create_task(broadcast_empleados({
        "tipo": "empleado_modulos_actualizados",
        "descripcion": f"Módulos actualizados: {empleado.nombre}",
        "fecha": datetime.now().isoformat(),
        "payload": empleado.__dict__,
    }))

    return empleado


# ---------------------------------------------------------
# ACTUALIZAR PERMISOS
# ---------------------------------------------------------
@router.put("/{empleado_id}/permisos")
async def actualizar_permisos(empleado_id: int, permisos: dict, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado.permisos_modulo_dict = permisos
    db.commit()
    db.refresh(empleado)

    empleado = _sanear_jsonb_empleado(empleado)

    loop = asyncio.get_running_loop()
    loop.create_task(broadcast_empleados({
        "tipo": "empleado_permisos_actualizados",
        "descripcion": f"Permisos actualizados: {empleado.nombre}",
        "fecha": datetime.now().isoformat(),
        "payload": empleado.__dict__,
    }))

    return empleado
