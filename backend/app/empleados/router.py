from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.empleados.models import Empleado
from app.empleados.schemas import (
    EmpleadoCreate,
    EmpleadoUpdate,
    EmpleadoResponse
)
from app.empleados.service import (
    crear_empleado,
    editar_empleado,
    listar_empleados
)

router = APIRouter(prefix="/empleados", tags=["Empleados"])

# ---------------------------------------------------------
# SUBIR FOTO DE EMPLEADO
# ---------------------------------------------------------
@router.post("/{empleado_id}/foto", response_model=EmpleadoResponse)
def subir_foto(empleado_id: int, archivo: UploadFile = File(...), db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # Carpeta destino
    carpeta = "static/fotos_empleados"
    os.makedirs(carpeta, exist_ok=True)

    # Nombre del archivo
    ruta_archivo = f"{carpeta}/empleado_{empleado_id}.jpg"

    # Guardar archivo
    with open(ruta_archivo, "wb") as f:
        f.write(archivo.file.read())

    # URL pública
    empleado.foto = f"/static/fotos_empleados/empleado_{empleado_id}.jpg"

    db.commit()
    db.refresh(empleado)

    return empleado

# ---------------------------------------------------------
# LISTAR TODOS
# ---------------------------------------------------------
@router.get("/", response_model=list[EmpleadoResponse])
def listar(db: Session = Depends(get_db)):
    return listar_empleados(db)

# ---------------------------------------------------------
# OBTENER UNO POR ID
# ---------------------------------------------------------
@router.get("/{empleado_id}", response_model=EmpleadoResponse)
def obtener(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado

# ---------------------------------------------------------
# CREAR EMPLEADO
# ---------------------------------------------------------
@router.post("/", response_model=EmpleadoResponse)
def crear(data: EmpleadoCreate, db: Session = Depends(get_db)):
    return crear_empleado(db, data)

# ---------------------------------------------------------
# EDITAR EMPLEADO
# ---------------------------------------------------------
@router.put("/{empleado_id}", response_model=EmpleadoResponse)
def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado = editar_empleado(db, empleado_id, data)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado

# ---------------------------------------------------------
# ELIMINAR EMPLEADO
# ---------------------------------------------------------
@router.delete("/{empleado_id}")
def eliminar(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    db.delete(empleado)
    db.commit()
    return {"detail": "Empleado eliminado correctamente"}
