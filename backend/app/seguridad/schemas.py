

from pydantic import BaseModel
from typing import List, Optional, Dict

# ---------------------------------------------------------
# PERMISOS
# ---------------------------------------------------------
class PermisoBase(BaseModel):
    modulo: str
    acciones: str  # "ver,crear,editar,eliminar"

class PermisoOut(PermisoBase):
    id: int
    class Config:
        orm_mode = True

# ---------------------------------------------------------
# ROLES
# ---------------------------------------------------------
class RolBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class RolCreate(RolBase):
    permisos: List[PermisoBase]

class RolOut(RolBase):
    id: int
    permisos: List[PermisoOut]
    class Config:
        orm_mode = True

# ---------------------------------------------------------
# EVENTOS DE SEGURIDAD
# ---------------------------------------------------------
class EventoCreate(BaseModel):
    tipo: str
    usuario_id: int
    detalle: Optional[str] = ""
    ip: Optional[str] = ""
    user_agent: Optional[str] = ""

class Evento(BaseModel):
    id: int
    tipo: str
    usuario_id: int
    detalle: str
    ip: str
    user_agent: str
    creado_en: str

    class Config:
        orm_mode = True

# ---------------------------------------------------------
# AUDITORÍA
# ---------------------------------------------------------
class AuditoriaCreate(BaseModel):
    usuario_id: int
    modulo: str
    accion: str
    datos: Dict = {}

class AuditoriaOut(AuditoriaCreate):
    id: int
    creado_en: str

    class Config:
        orm_mode = True
