from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
import os

from app.database import get_db
from app.empleados.models import Empleado
from app.empleados.schemas import (
    EmpleadoCreate,
    EmpleadoUpdate,
    EmpleadoResponse,
    EmpleadoSearchResponse
)

# 🔥 IMPORTAR FUNCIONES DEL SERVICE (ESTO ES LO QUE FALTABA)
from app.empleados.service import (
    crear_empleado,
    editar_empleado as editar_empleado_service,
    eliminar_empleado,
    listar_empleados
)

router = APIRouter(prefix="/empleados", tags=["Empleados"])

# ---------------------------------------------------------
# LISTA DE MÓDULOS Y PERMISOS DEL ERP
# ---------------------------------------------------------
@router.get("/modulos")
def obtener_modulos_y_permisos():
    modulos = [
        "auth", "seguridad", "permisos",
        "empleados", "maestros",
        "noticias", "documentos",
        "ctn",
        "agenda", "agenda_notarios",
        "auditoria", "dashboard", "informes",
        "logs", "mensajes", "realtime",
        "utilidades"
    ]

    permisos = ["oculto", "ver", "crear", "editar", "eliminar"]

    return {"modulos": modulos, "permisos": permisos}

# ---------------------------------------------------------
# SUBIR FOTO DE EMPLEADO
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
# ACTUALIZAR PERMISOS Y MÓDULOS
# ---------------------------------------------------------
@router.put("/{empleado_id}/permisos", response_model=EmpleadoResponse)
def actualizar_permisos(
    empleado_id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado.modulos_visibles = data.get("modulos_visibles", [])
    empleado.permisos_modulo = data.get("permisos_modulo", {})

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
# BÚSQUEDA + FILTROS + PAGINACIÓN
# ---------------------------------------------------------
@router.get("/search", response_model=EmpleadoSearchResponse)
def buscar_empleados(
    db: Session = Depends(get_db),
    q: str = "",
    departamento_id: int = None,
    seccion_id: int = None,
    cargo_id: int = None,
    activo: bool = None,
    page: int = 1,
    limit: int = 20
):
    query = db.query(Empleado)

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
# EDITAR EMPLEADO (FIX DEFINITIVO)
# ---------------------------------------------------------
@router.put("/{empleado_id}", response_model=EmpleadoResponse)
def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado = editar_empleado_service(db, empleado_id, data)
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
