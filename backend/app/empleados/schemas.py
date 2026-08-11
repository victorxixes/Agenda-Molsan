from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class EmpleadoBase(BaseModel):
    nombre: str
    apellidos: None
    dni: Optional[str] = str
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

    # IMPORTANTÍSIMO: evitar defaults mutables
    modulos_visibles: List[str] = Field(default_factory=list)
    permisos_modulo: Dict[str, List[str]] = Field(default_factory=dict)

class EmpleadoCreate(BaseModel):
    nombre: str
    dni: str

class EmpleadoUpdate(EmpleadoBase):
    usuario: Optional[str] = None
    password: Optional[str] = None

class EmpleadoResponse(EmpleadoBase):
    id: int
    usuario: str
    activo: bool

    class Config:
        orm_mode = True
