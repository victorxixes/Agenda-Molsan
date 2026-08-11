from pydantic import BaseModel
from typing import Optional, List, Dict

class EmpleadoBase(BaseModel):
    nombre: str
    apellidos: str
    dni: Optional[str] = None
    telefono: Optional[str] = None
    email_personal: Optional[str] = None
    direccion: Optional[str] = None
    fecha_nacimiento: Optional[str] = None

    departamento_id: Optional[int] = None
    seccion_id: Optional[int] = None
    cargo_id: Optional[int] = None

    email_empresa: Optional[str] = None
    extension: Optional[str] = None
    fecha_alta: Optional[str] = None
    fecha_baja: Optional[str] = None

    alergias: Optional[str] = None
    persona_contacto: Optional[str] = None
    telefono_contacto: Optional[str] = None
    observaciones: Optional[str] = None

    modulos_visibles: List[str] = []
    permisos_modulo: Dict[str, List[str]] = {}

class EmpleadoCreate(EmpleadoBase):
    usuario: str
    password: str

class EmpleadoUpdate(EmpleadoBase):
    usuario: Optional[str] = None
    password: Optional[str] = None

class EmpleadoResponse(EmpleadoBase):
    id: int
    usuario: str
    activo: bool

    class Config:
        orm_mode = True
