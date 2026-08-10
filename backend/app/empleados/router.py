from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app.database import get_db

from app.empleados.service import (
    listar_empleados,
    obtener_empleado,
    eliminar_empleado,
    inhabilitar_empleado,
    habilitar_empleado,
    resetear_password,
    actualizar_modulos_visibles,
    actualizar_permisos_modulo,
    crear_empleado_completo,
    editar_empleado_completo
)

router = APIRouter(prefix="/empleados", tags=["Empleados"])

@router.get("")
def listar_sin_barra(db: Session = Depends(get_db)):
    return listar_empleados(db)

@router.get("/")
def listar(db: Session = Depends(get_db)):
    return listar_empleados(db)

@router.get("/{empleado_id}")
def obtener(empleado_id: int, db: Session = Depends(get_db)):
    return obtener_empleado(db, empleado_id)

@router.delete("/{empleado_id}")
def eliminar(empleado_id: int, db: Session = Depends(get_db)):
    return eliminar_empleado(db, empleado_id)

@router.put("/{empleado_id}/inhabilitar")
def inhabilitar(empleado_id: int, db: Session = Depends(get_db)):
    return inhabilitar_empleado(db, empleado_id)

@router.put("/{empleado_id}/habilitar")
def habilitar(empleado_id: int, db: Session = Depends(get_db)):
    return habilitar_empleado(db, empleado_id)

@router.put("/{empleado_id}/reset-password")
def reset_password(empleado_id: int, nueva_password: str, db: Session = Depends(get_db)):
    return resetear_password(db, empleado_id, nueva_password)

@router.put("/{empleado_id}/modulos")
def actualizar_modulos(empleado_id: int, modulos: list[str], db: Session = Depends(get_db)):
    return actualizar_modulos_visibles(db, empleado_id, modulos)

@router.put("/{empleado_id}/permisos")
def actualizar_permisos(empleado_id: int, permisos: dict, db: Session = Depends(get_db)):
    return actualizar_permisos_modulo(db, empleado_id, permisos)

@router.put("/editar-completo/{empleado_id}")
async def editar_empleado_completo_endpoint(
    empleado_id: int,
    data: str = Form(...),
    foto: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    return await editar_empleado_completo(db, empleado_id, data, foto)

@router.post("/crear-completo")
async def crear_empleado_completo_endpoint(
    data: str = Form(...),
    foto: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    return await crear_empleado_completo(db, data, foto)
