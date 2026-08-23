from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
import os

from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from backend.app.maestros.models import Departamento, Seccion, Cargo

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
# LISTAS PARA SELECTS
# ---------------------------------------------------------
@router.get("/departamentos")
def listar_departamentos(db: Session = Depends(get_db)):
    return db.query(Departamento).all()

@router.get("/secciones")
def listar_secciones(db: Session = Depends(get_db)):
    return db.query(Seccion).all()

@router.get("/cargos")
def listar_cargos(db: Session = Depends(get_db)):
    return db.query(Cargo).all()

# ---------------------------------------------------------
# SUBIR FOTO
# ---------------------------------------------------------
@router.post("/{empleado_id}/foto", response_model=EmpleadoResponse)
def subir_foto(empleado_id: int, archivo: UploadFile = File(...), db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    carpeta = "static/fotos_empleados"
    os.makedirs(carpeta, exist_ok=True)

    ruta_archivo = f"{carpeta}/empleado_{empleado_id}.jpg"

    with open(ruta_archivo, "wb") as f:
        f.write(archivo.file.read())

    empleado.foto = f"/static/fotos_empleados/empleado_{empleado_id}.jpg"

    db.commit()
    db.refresh(empleado)

    return empleado

# ---------------------------------------------------------
# LISTAR
# ---------------------------------------------------------
@router.get("", response_model=list[EmpleadoResponse])
def listar(db: Session = Depends(get_db)):
    return listar_empleados(db)

# ---------------------------------------------------------
# BUSCAR + FILTROS + PAGINACIÓN
# ---------------------------------------------------------
@router.get("/search", response_model=EmpleadoSearchResponse)
def buscar_empleados(
    db: Session = Depends(get_db),
    q: str = "",
    id: int = None,
    dni: str = None,
    departamento_id: int = None,
    seccion_id: int = None,
    cargo_id: int = None,
    activo: bool = None,
    page: int = 1,
    limit: int = 20
):
    query = db.query(Empleado)

    if id is not None:
        query = query.filter(Empleado.id == id)

    if dni:
        query = query.filter(Empleado.dni.ilike(f"%{dni}%"))

    if q:
        query = query.filter(
            or_(
                Empleado.nombre.ilike(f"%{q}%"),
                Empleado.apellidos.ilike(f"%{q}%"),
                Empleado.dni.ilike(f"%{q}%")
            )
        )

    if departamento_id is not None:
        query = query.filter(Empleado.departamento_id == departamento_id)

    if seccion_id is not None:
        query = query.filter(Empleado.seccion_id == seccion_id)

    if cargo_id is not None:
        query = query.filter(Empleado.cargo_id == cargo_id)

    if activo is not None:
        query = query.filter(Empleado.activo == activo)

    total = query.count()
    pages = (total + limit - 1) // limit
    offset = (page - 1) * limit

    empleados = query.offset(offset).limit(limit).all()

    return EmpleadoSearchResponse(
        total=total,
        page=page,
        pages=pages,
        limit=limit,
        offset=offset,
        items=empleados
    )

# ---------------------------------------------------------
# OBTENER UNO
# ---------------------------------------------------------
@router.get("/{empleado_id}", response_model=EmpleadoResponse)
def obtener(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado

# ---------------------------------------------------------
# CREAR
# ---------------------------------------------------------
@router.post("/", response_model=EmpleadoResponse)
def crear(data: EmpleadoCreate, db: Session = Depends(get_db)):
    return crear_empleado(db, data)

# ---------------------------------------------------------
# EDITAR
# ---------------------------------------------------------
@router.put("/{empleado_id}", response_model=EmpleadoResponse)
def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado = editar_empleado_service(db, empleado_id, data)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado

# ---------------------------------------------------------
# ELIMINAR
# ---------------------------------------------------------
@router.delete("/{empleado_id}")
def eliminar(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    db.delete(empleado)
    db.commit()
    return {"detail": "Empleado eliminado correctamente"}

# ---------------------------------------------------------
# ACTUALIZAR MÓDULOS VISIBLES
# ---------------------------------------------------------
@router.put("/{empleado_id}/permisos")
def actualizar_modulos(empleado_id: int, data: dict, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    if "modulos" not in data:
        raise HTTPException(status_code=400, detail="Faltan los módulos")

    empleado.modulos_visibles = ",".join(data["modulos"])

    db.commit()
    db.refresh(empleado)

    return {"detail": "Módulos actualizados correctamente"}

# ---------------------------------------------------------
# ACTUALIZAR PERMISOS DEL EMPLEADO
# ---------------------------------------------------------
@router.put("/{empleado_id}/permisos-detalle")
def actualizar_permisos(empleado_id: int, data: dict, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    if "permisos" not in data:
        raise HTTPException(status_code=400, detail="Faltan los permisos")

    empleado.permisos = ",".join(data["permisos"])

    db.commit()
    db.refresh(empleado)

    return {"detail": "Permisos actualizados correctamente"}

@router.get("/debug/columns")
def debug_columns():
    from backend.app.empleados.models import Empleado
    return Empleado.__table__.columns.keys()
