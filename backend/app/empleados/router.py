from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import json

from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from backend.app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate, EmpleadoResponse
from backend.app.empleados.service import (
    crear_empleado,
    editar_empleado as editar_empleado_service,
    listar_empleados,
    obtener_empleado,
    eliminar_empleado
)
from backend.app.websockets.empleados_ws import broadcast_empleados

router = APIRouter(prefix="/empleados", tags=["Empleados"])

@router.get("/debug-empleados")
def debug(db: Session = Depends(get_db)):
    empleados = db.query(Empleado).all()
    salida = []
    for e in empleados:
        try:
            _sanear_jsonb_empleado(e)
            salida.append({"id": e.id, "ok": True})
        except Exception as err:
            salida.append({"id": e.id, "error": str(err)})
    return salida


# ---------------------------------------------------------
# SANEAR CAMPOS JSONB (PostgreSQL)
# ---------------------------------------------------------
def _sanear_jsonb_empleado(e: Empleado):

    # Relaciones anuladas para evitar recursión
    e.departamento = None
    e.seccion = None
    e.cargo = None

    # Nombre del rol
    e.rol_nombre = e.rol.nombre if e.rol else None

    # -----------------------------
    # MODULOS VISIBLES
    # -----------------------------
    mv = e.modulos_visibles_list

    if isinstance(mv, str):
        try:
            mv = json.loads(mv)
        except:
            mv = []
    elif not isinstance(mv, list):
        mv = []

    # Compatibilidad ERP antiguo
    if hasattr(e, "modulos_visibles") and e.modulos_visibles:
        try:
            mv = json.loads(e.modulos_visibles) if isinstance(e.modulos_visibles, str) else e.modulos_visibles
        except:
            mv = []

    e.modulos_visibles_list = mv

    # -----------------------------
    # PERMISOS POR MÓDULO
    # -----------------------------
    pm = e.permisos_modulo_dict

    if isinstance(pm, str):
        try:
            pm = json.loads(pm)
        except:
            pm = {}
    elif not isinstance(pm, dict):
        pm = {}

    # Compatibilidad ERP antiguo
    if hasattr(e, "permisos_modulo") and e.permisos_modulo:
        try:
            pm = json.loads(e.permisos_modulo) if isinstance(e.permisos_modulo, str) else e.permisos_modulo
        except:
            pm = {}

    e.permisos_modulo_dict = pm

    return e


# ---------------------------------------------------------
# LISTAR EMPLEADOS
# ---------------------------------------------------------
@router.get("", response_model=list[EmpleadoResponse])
async def listar(db: Session = Depends(get_db)):
    empleados = listar_empleados(db)
    empleados = [_sanear_jsonb_empleado(e) for e in empleados]

    await broadcast_empleados()
    return empleados


# ---------------------------------------------------------
# CREAR EMPLEADO
# ---------------------------------------------------------
@router.post("/", response_model=EmpleadoResponse)
async def crear(data: EmpleadoCreate, db: Session = Depends(get_db)):
    empleado = crear_empleado(db, data)
    empleado = _sanear_jsonb_empleado(empleado)

    await broadcast_empleados()
    return empleado


# ---------------------------------------------------------
# EDITAR EMPLEADO
# ---------------------------------------------------------
@router.put("/{empleado_id}", response_model=EmpleadoResponse)
async def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado = editar_empleado_service(db, empleado_id, data)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado = _sanear_jsonb_empleado(empleado)

    await broadcast_empleados()
    return empleado


# ---------------------------------------------------------
# ACTUALIZAR MÓDULOS DEL EMPLEADO
# ---------------------------------------------------------
@router.put("/{empleado_id}/modulos", response_model=EmpleadoResponse)
async def actualizar_modulos(empleado_id: int, modulos: dict, db: Session = Depends(get_db)):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # Asegurar JSONB válido
    nuevos = modulos.get("modulos_visibles", modulos)
    if not isinstance(nuevos, list):
        raise HTTPException(status_code=400, detail="modulos_visibles debe ser una lista")

    empleado.modulos_visibles_list = nuevos

    db.commit()
    db.refresh(empleado)

    await broadcast_empleados()
    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# ACTUALIZAR PERMISOS DEL EMPLEADO
# ---------------------------------------------------------
@router.put("/{empleado_id}/permisos", response_model=EmpleadoResponse)
async def actualizar_permisos(empleado_id: int, permisos: dict, db: Session = Depends(get_db)):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    nuevos = permisos.get("permisos_modulo", permisos)
    if not isinstance(nuevos, dict):
        raise HTTPException(status_code=400, detail="permisos_modulo debe ser un dict")

    empleado.permisos_modulo_dict = nuevos

    db.commit()
    db.refresh(empleado)

    await broadcast_empleados()
    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# SUBIR FOTO DEL EMPLEADO
# ---------------------------------------------------------
@router.post("/{empleado_id}/foto", response_model=EmpleadoResponse)
async def subir_foto(empleado_id: int, archivo: UploadFile = File(...), db: Session = Depends(get_db)):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    contenido = await archivo.read()
    empleado.foto = contenido.decode("latin1")  # o base64 si prefieres

    db.commit()
    db.refresh(empleado)

    await broadcast_empleados()
    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# ELIMINAR EMPLEADO
# ---------------------------------------------------------
@router.delete("/{empleado_id}")
async def eliminar(empleado_id: int, db: Session = Depends(get_db)):
    ok = eliminar_empleado(db, empleado_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    await broadcast_empleados()
    return {"status": "ok"}
