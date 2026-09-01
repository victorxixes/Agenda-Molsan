from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# ---------------------------------------------------------
# PERMISOS (NO se usan en roles, solo en empleados antiguos)
# ---------------------------------------------------------
class PermisoBase(BaseModel):
    modulo: str
    acciones: str  # "ver,crear,editar,eliminar"

class PermisoOut(PermisoBase):
    id: int
    class Config:
        orm_mode = True


# ---------------------------------------------------------
# ROLES COMPLETOS
# ---------------------------------------------------------
class RolBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    permisos_modulo_dict: Dict[str, List[str]] = Field(default_factory=dict)
    modulos_visibles_list: List[str] = Field(default_factory=list)

class RolCreate(RolBase):
    pass

class RolUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    permisos_modulo_dict: Optional[Dict[str, List[str]]] = None
    modulos_visibles_list: Optional[List[str]] = None

class RolResponse(RolBase):
    id: int

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
