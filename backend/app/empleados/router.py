from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os

from backend.app.database import SessionLocal
from backend.app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
from backend.app.empleados.service import (
    listar_empleados,
    crear_empleado,
    editar_empleado,
    eliminar_empleado,
    obtener_empleado,
    login_empleado
)

router = APIRouter(prefix="/empleados", tags=["Empleados"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(usuario: str, password: str, db: Session = Depends(get_db)):
    resultado = login_empleado(db, usuario, password)
    if not resultado:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    return resultado

@router.get("/")
def listar(db: Session = Depends(get_db)):
    return listar_empleados(db)

@router.get("/{empleado_id}")
def obtener(empleado_id: int, db: Session = Depends(get_db)):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado

@router.post("/")
def crear(data: EmpleadoCreate, db: Session = Depends(get_db)):
    try:
        return crear_empleado(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{empleado_id}")
def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado = editar_empleado(db, empleado_id, data)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado

@router.delete("/{empleado_id}")
def eliminar(empleado_id: int, db: Session = Depends(get_db)):
    ok = eliminar_empleado(db, empleado_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return {"status": "ok", "message": "Empleado eliminado"}

@router.post("/{empleado_id}/foto")
def subir_foto(empleado_id: int, archivo: UploadFile = File(...), db: Session = Depends(get_db)):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # Carpeta destino REAL
    fotos_dir = os.path.join(os.path.dirname(__file__), "..", "fotos", "empleados")
    os.makedirs(fotos_dir, exist_ok=True)

    # Nombre del archivo
    extension = archivo.filename.split(".")[-1]
    nombre_archivo = f"empleado_{empleado_id}.{extension}"

    ruta_archivo = os.path.join(fotos_dir, nombre_archivo)

    # Guardar archivo
    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    # URL pública
    url_publica = f"/api/fotos/empleados/{nombre_archivo}"

    # Guardar en BD
    empleado.foto = url_publica
    db.commit()
    db.refresh(empleado)

    return {
        "status": "ok",
        "foto_url": url_publica
    }
