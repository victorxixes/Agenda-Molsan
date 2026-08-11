from pydantic import BaseModel
from typing import Optional, Dict, List

# ---------------------------------------------------------
# SCHEMA BASE
# ---------------------------------------------------------
class EmpleadoBase(BaseModel):
    nombre: Optional[str] = None
    apellidos: Optional[str] = None
    dni: Optional[str] = None
    telefono: Optional[str] = None
    email_personal: Optional[str] = None
    direccion: Optional[str] = None
    fecha_nacimiento: Optional[str] = None

    alergias: Optional[str] = None
    persona_contacto: Optional[str] = None
    telefono_contacto: Optional[str] = None
    observaciones: Optional[str] = None

    departamento_id: Optional[int] = None
    seccion_id: Optional[int] = None
    cargo_id: Optional[int] = None

    email_empresa: Optional[str] = None
    extension: Optional[str] = None
    fecha_alta: Optional[str] = None
    fecha_baja: Optional[str] = None

    activo: Optional[bool] = True

    usuario: Optional[str] = None
    password: Optional[str] = None

    foto: Optional[str] = None

    modulos_visibles: Optional[List[str]] = None
    permisos_modulo: Optional[Dict[str, List[str]]] = None

# ---------------------------------------------------------
# CREATE
# ---------------------------------------------------------
class EmpleadoCreate(EmpleadoBase):
    nombre: str
    dni: str

# ---------------------------------------------------------
# UPDATE
# ---------------------------------------------------------
class EmpleadoUpdate(EmpleadoBase):
    pass

# ---------------------------------------------------------
# RESPONSE
# ---------------------------------------------------------
class EmpleadoResponse(EmpleadoBase):
    id: int

    class Config:
        orm_mode = True

# ---------------------------------------------------------
# SEARCH RESPONSE (paginación)
# ---------------------------------------------------------
class EmpleadoSearchResponse(BaseModel):
    total: int
    page: int
    pages: int
    limit: int
    offset: int
    items: list[EmpleadoResponse]
