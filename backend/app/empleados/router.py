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


# ---------------------------------------------------------
# SANEAR CAMPOS JSONB (PostgreSQL)
# ---------------------------------------------------------
def _sanear_jsonb_empleado(e: Empleado):

    e.departamento = None
    e.seccion = None
    e.cargo = None

    e.rol_nombre = e.rol.nombre if e.rol else None

    mv = e.modulos_visibles_list
    if isinstance(mv, str):
        try:
            mv = json.loads(mv)
        except:
            mv = []
    elif not isinstance(mv, list):
        mv = []

    if hasattr(e, "modulos_visibles") and e.modulos_visibles:
        try:
            mv = json.loads(e.modulos_visibles) if isinstance(e.modulos_visibles, str) else e.modulos_visibles
        except:
            mv = []

    e.modulos_visibles_list = mv

    pm = e.permisos_modulo_dict
    if isinstance(pm, str):
        try:
            pm = json.loads(pm)
        except:
            pm = {}
    elif not isinstance(pm, dict):
        pm = {}

    if hasattr(e, "permisos_modulo") and e.permisos_modulo:
        try:
            pm = json.loads(e.permisos_modulo) if isinstance(e.permisos_modulo, str) else e.permisos_modulo
        except:
            pm = {}

    e.permisos_modulo_dict = pm

    return e


# ---------------------------------------------------------
# DEBUG EMPLEADOS
# ---------------------------------------------------------
@router.get("/debug-empleados")
def debug_empleados(db: Session = Depends(get_db)):
    empleados = db.query(Empleado).all()
    salida = []

    for e in empleados:
        try:
            _ = e.rol.nombre if e.rol else None
            _sanear_jsonb_empleado(e)

            salida.append({"id": e.id, "usuario": e.usuario, "estado": "OK"})
        except Exception as err:
            salida.append({
                "id": e.id,
                "usuario": e.usuario,
                "estado": "ERROR",
                "error": str(err)
            })

    return salida
