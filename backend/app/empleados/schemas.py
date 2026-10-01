from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File
)

from sqlalchemy.orm import Session

import shutil
import os

from backend.app.database import SessionLocal

from backend.app.empleados.schemas import (
    Empleado,
    EmpleadoCreate,
    EmpleadoUpdate,
    LoginEmpleado
)

from backend.app.empleados.service import (
    listar_empleados,
    crear_empleado,
    editar_empleado,
    eliminar_empleado,
    obtener_empleado,
    login_empleado,
    actualizar_modulos_visibles,
    actualizar_permisos_modulo,
    reset_password
)

from backend.app.seguridad.auditoria.service import (
    obtener_auditoria_empleado
)


router = APIRouter(
    prefix="/empleados",
    tags=["Empleados"]
)


# =========================================================
# DB
# =========================================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================================================
# BUSCADOR
# =========================================================

@router.get(
    "/search",
    response_model=list[Empleado]
)
def buscar(
    q: str | None = None,
    activo: bool | None = None,
    db: Session = Depends(get_db)
):

    return listar_empleados(
        db,
        q=q,
        activo=activo
    )


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(
    data: LoginEmpleado,
    db: Session = Depends(get_db)
):

    resultado = login_empleado(
        db,
        data.usuario,
        data.password
    )

    if resultado is None:

        return {
            "status": "error",
            "message": "Credenciales incorrectas"
        }

    return {
        "status": "ok",
        **resultado
    }


# =========================================================
# LISTADO
# =========================================================

@router.get(
    "/",
    response_model=list[Empleado]
)
def listar(
    db: Session = Depends(get_db)
):

    return listar_empleados(db)


# =========================================================
# OBTENER
# =========================================================

@router.get(
    "/{empleado_id}",
    response_model=Empleado
)
def obtener(
    empleado_id: int,
    db: Session = Depends(get_db)
):

    empleado = obtener_empleado(
        db,
        empleado_id
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    return empleado


# =========================================================
# FICHA COMPLETA
# =========================================================

@router.get(
    "/{empleado_id}/ficha",
)
def ficha(
    empleado_id: int,
    db: Session = Depends(get_db)
):

    empleado = obtener_empleado(
        db,
        empleado_id
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    auditoria = obtener_auditoria_empleado(
        db,
        empleado.usuario
    )

    return {
        "empleado": empleado,
        "auditoria": auditoria
    }


# =========================================================
# CREAR
# =========================================================

@router.post(
    "/",
    response_model=Empleado
)
def crear(
    data: EmpleadoCreate,
    db: Session = Depends(get_db)
):

    try:

        return crear_empleado(
            db,
            data
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# =========================================================
# EDITAR
# =========================================================

@router.put(
    "/{empleado_id}",
    response_model=Empleado
)
def editar(
    empleado_id: int,
    data: EmpleadoUpdate,
    db: Session = Depends(get_db)
):

    empleado = editar_empleado(
        db,
        empleado_id,
        data
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    return empleado


# =========================================================
# ELIMINAR
# =========================================================

@router.delete(
    "/{empleado_id}"
)
def eliminar(
    empleado_id: int,
    db: Session = Depends(get_db)
):

    ok = eliminar_empleado(
        db,
        empleado_id
    )

    if not ok:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    return {
        "status": "ok",
        "message": "Empleado eliminado"
    }


# =========================================================
# FOTO
# =========================================================

@router.post(
    "/{empleado_id}/foto"
)
def subir_foto(
    empleado_id: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    empleado = obtener_empleado(
        db,
        empleado_id
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    if not archivo.filename:

        raise HTTPException(
            status_code=400,
            detail="Archivo no válido"
        )

    extension = (
        archivo.filename
        .split(".")[-1]
        .lower()
    )

    extensiones_permitidas = {
        "jpg",
        "jpeg",
        "png",
        "webp"
    }

    if extension not in extensiones_permitidas:

        raise HTTPException(
            status_code=400,
            detail="Formato de imagen no permitido"
        )

    fotos_dir = os.path.join(
        os.path.dirname(__file__),
        "static",
        "fotos",
        "empleados"
    )

    os.makedirs(
        fotos_dir,
        exist_ok=True
    )

    nombre_archivo = (
        f"empleado_{empleado_id}.{extension}"
    )

    ruta_archivo = os.path.join(
        fotos_dir,
        nombre_archivo
    )

    with open(
        ruta_archivo,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            archivo.file,
            buffer
        )

    url_publica = (
        f"/api/fotos/empleados/{nombre_archivo}"
    )

    empleado.foto = url_publica

    db.commit()

    db.refresh(empleado)

    return {
        "status": "ok",
        "foto_url": url_publica
    }


# =========================================================
# FOTO DIRECTA
# =========================================================

@router.get(
    "/{empleado_id}/foto"
)
def obtener_foto(
    empleado_id: int,
    db: Session = Depends(get_db)
):

    empleado = obtener_empleado(
        db,
        empleado_id
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    return {
        "foto": empleado.foto
    }


# =========================================================
# MÓDULOS VISIBLES
# =========================================================

@router.put(
    "/{empleado_id}/modulos",
    response_model=Empleado
)
def actualizar_modulos(
    empleado_id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    if "modulos_visibles_list" not in data:

        raise HTTPException(
            status_code=400,
            detail="Falta modulos_visibles_list"
        )

    empleado = actualizar_modulos_visibles(
        db,
        empleado_id,
        data["modulos_visibles_list"]
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    return empleado


# =========================================================
# PERMISOS
# =========================================================

@router.put(
    "/{empleado_id}/permisos",
    response_model=Empleado
)
def actualizar_permisos(
    empleado_id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    if "permisos_modulo_dict" not in data:

        raise HTTPException(
            status_code=400,
            detail="Falta permisos_modulo_dict"
        )

    empleado = actualizar_permisos_modulo(
        db,
        empleado_id,
        data["permisos_modulo_dict"]
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    return empleado


# =========================================================
# RESET PASSWORD
# =========================================================

@router.post(
    "/{empleado_id}/reset-password"
)
def reset_password_empleado(
    empleado_id: int,
    db: Session = Depends(get_db)
):

    resultado = reset_password(
        db,
        empleado_id
    )

    if not resultado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    return resultado
