from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
import os
import json

from backend.app.database import get_db
from backend.app.empleados.models import Empleado

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
# UTILIDAD: SANEAR JSONB DE UN EMPLEADO
# ---------------------------------------------------------
def _sanear_jsonb_empleado(e: Empleado):
    # relaciones fuera
    e.departamento = None
    e.seccion = None
    e.cargo = None

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
# 🔥 FIX JSONB
# ---------------------------------------------------------
@router.put("/fix-jsonb-safe")
def fix_jsonb_safe(db: Session = Depends(get_db)):
    empleados = db.query(Empleado).all()
    cambios = []

    for e in empleados:
        original_mv = e.modulos_visibles
        original_pm = e.permisos_modulo

        _sanear_jsonb_empleado(e)

        if e.modulos_visibles != original_mv or e.permisos_modulo != original_pm:
            cambios.append(e.id)

    db.commit()

    return {
        "detail": "JSONB corregido",
        "empleados_corregidos": cambios
    }


# ---------------------------------------------------------
# SELECTS
# ---------------------------------------------------------
@router.get("/departamentos")
def listar_departamentos(db: Session = Depends(get_db)):
    return db.execute("SELECT id, nombre, descripcion FROM departamentos").fetchall()


@router.get("/secciones")
def listar_secciones(db: Session = Depends(get_db)):
    return db.execute("SELECT id, nombre, descripcion FROM secciones").fetchall()


@router.get("/cargos")
def listar_cargos(db: Session = Depends(get_db)):
    return db.execute("SELECT id, nombre, descripcion FROM cargos").fetchall()

# ---------------------------------------------------------
# SUBIR FOTO (RENDER SAFE)
# ---------------------------------------------------------
@router.post("/{empleado_id}/foto", response_model=EmpleadoResponse)
def subir_foto(empleado_id: int, archivo: UploadFile = File(...), db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    carpeta = "/tmp/fotos_empleados"
    os.makedirs(carpeta, exist_ok=True)

    ruta_archivo = f"{carpeta}/empleado_{empleado_id}.jpg"

    with open(ruta_archivo, "wb") as f:
        f.write(archivo.file.read())

    empleado.foto = ruta_archivo

    db.commit()
    db.refresh(empleado)

    return _sanear_jsonb_empleado(empleado)

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
    empleado = crear_empleado(db, data)
    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# EDITAR
# ---------------------------------------------------------
@router.put("/{empleado_id}", response_model=EmpleadoResponse)
def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado = editar_empleado_service(db, empleado_id, data)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    return _sanear_jsonb_empleado(empleado)


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
# ACTUALIZAR MÓDULOS
# ---------------------------------------------------------
@router.put("/{empleado_id}/permisos")
def actualizar_modulos(empleado_id: int, data: dict, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    if "modulos" not in data:
        raise HTTPException(status_code=400, detail="Faltan los módulos")

    empleado.modulos_visibles = data["modulos"]

    db.commit()
    db.refresh(empleado)

    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# ACTUALIZAR PERMISOS
# ---------------------------------------------------------
@router.put("/{empleado_id}/permisos-detalle")
def actualizar_permisos(empleado_id: int, data: dict, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    if "permisos" not in data:
        raise HTTPException(status_code=400, detail="Faltan los permisos")

    empleado.permisos_modulo = data["permisos"]

    db.commit()
    db.refresh(empleado)

    return _sanear_jsonb_empleado(empleado)


# ---------------------------------------------------------
# SEARCH
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

    empleados_saneados = [_sanear_jsonb_empleado(e) for e in empleados]

    return EmpleadoSearchResponse(
        total=total,
        page=page,
        pages=pages,
        limit=limit,
        offset=offset,
        items=empleados_saneados
    )


# ---------------------------------------------------------
# DEBUG RAW
# ---------------------------------------------------------
@router.get("/debug/raw")
def debug_raw(db: Session = Depends(get_db)):
    empleados = db.query(Empleado).all()
    salida = []
    for e in empleados:
        salida.append({
            "id": e.id,
            "modulos_visibles": e.modulos_visibles,
            "permisos_modulo": e.permisos_modulo,
            "usuario": e.usuario,
            "dni": e.dni
        })
    return salida
