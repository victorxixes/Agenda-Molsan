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
    login_empleado,
    actualizar_modulos_visibles,
    actualizar_permisos_modulo
)

router = APIRouter(prefix="/empleados", tags=["Empleados"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------
# LOGIN
# -------------------------
@router.post("/login")
def login(usuario: str, password: str, db: Session = Depends(get_db)):
    resultado = login_empleado(db, usuario, password)
    if not resultado:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    return resultado

# -------------------------
# CRUD
# -------------------------
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

# -------------------------
# SUBIR FOTO
# -------------------------
@router.post("/{empleado_id}/foto")
def subir_foto(empleado_id: int, archivo: UploadFile = File(...), db: Session = Depends(get_db)):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    fotos_dir = os.path.join(os.path.dirname(__file__), "..", "fotos", "empleados")
    os.makedirs(fotos_dir, exist_ok=True)

    extension = archivo.filename.split(".")[-1]
    nombre_archivo = f"empleado_{empleado_id}.{extension}"
    ruta_archivo = os.path.join(fotos_dir, nombre_archivo)

    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    url_publica = f"/api/fotos/empleados/{nombre_archivo}"

    empleado.foto = url_publica
    db.commit()
    db.refresh(empleado)

    return {"status": "ok", "foto_url": url_publica}

# -------------------------
# ACTUALIZAR MÓDULOS VISIBLES
# -------------------------
@router.put("/{empleado_id}/modulos")
def actualizar_modulos(empleado_id: int, data: dict, db: Session = Depends(get_db)):
    if "modulos_visibles_list" not in data:
        raise HTTPException(status_code=400, detail="Falta modulos_visibles_list")

    empleado = actualizar_modulos_visibles(db, empleado_id, data["modulos_visibles_list"])
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    return empleado

# -------------------------
# ACTUALIZAR PERMISOS POR MÓDULO
# -------------------------
@router.put("/{empleado_id}/permisos")
def actualizar_permisos(empleado_id: int, data: dict, db: Session = Depends(get_db)):
    if "permisos_modulo_dict" not in data:
        raise HTTPException(status_code=400, detail="Falta permisos_modulo_dict")

    empleado = actualizar_permisos_modulo(db, empleado_id, data["permisos_modulo_dict"])
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    return empleado
