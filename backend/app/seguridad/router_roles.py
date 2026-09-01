# ---------------------------------------------------------
# ROUTER COMPLETO Y ESTABLE PARA ROLES
# ---------------------------------------------------------

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.service import (
    crear_rol,
    listar_roles,
    obtener_rol,
    editar_rol,
    eliminar_rol
)
from backend.app.seguridad.schemas import RolCreate, RolUpdate, RolResponse

router = APIRouter(
    prefix="/seguridad/roles",
    tags=["Seguridad - Roles"],
    redirect_slashes=False
)

# ---------------------------------------------------------
# LISTAR ROLES
# ---------------------------------------------------------
@router.get("", response_model=list[RolResponse])
def get_roles(db: Session = Depends(get_db)):
    return listar_roles(db)

# ---------------------------------------------------------
# OBTENER ROL
# ---------------------------------------------------------
@router.get("/{rol_id}", response_model=RolResponse)
def get_rol(rol_id: int, db: Session = Depends(get_db)):
    rol = obtener_rol(db, rol_id)
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return rol

# ---------------------------------------------------------
# CREAR ROL
# ---------------------------------------------------------
@router.post("", response_model=RolResponse)
def post_rol(data: RolCreate, db: Session = Depends(get_db)):
    return crear_rol(db, data)

# ---------------------------------------------------------
# EDITAR ROL
# ---------------------------------------------------------
@router.put("/{rol_id}", response_model=RolResponse)
def put_rol(rol_id: int, data: RolUpdate, db: Session = Depends(get_db)):
    rol = editar_rol(db, rol_id, data)
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return rol

# ---------------------------------------------------------
# ELIMINAR ROL
# ---------------------------------------------------------
@router.delete("/{rol_id}")
def delete_rol(rol_id: int, db: Session = Depends(get_db)):
    ok = eliminar_rol(db, rol_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return {"detail": "Rol eliminado correctamente"}

# ---------------------------------------------------------
# ACTUALIZAR PERMISOS DEL ROL
# ---------------------------------------------------------
@router.put("/{rol_id}/permisos", response_model=RolResponse)
def actualizar_permisos_rol(rol_id: int, permisos: dict, db: Session = Depends(get_db)):
    rol = editar_rol(db, rol_id, RolUpdate(permisos_modulo_dict=permisos))
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return rol

# ---------------------------------------------------------
# ACTUALIZAR MÓDULOS DEL ROL
# ---------------------------------------------------------
@router.put("/{rol_id}/modulos", response_model=RolResponse)
def actualizar_modulos_rol(rol_id: int, modulos: list, db: Session = Depends(get_db)):
    rol = editar_rol(db, rol_id, RolUpdate(modulos_visibles_list=modulos))
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return rol
