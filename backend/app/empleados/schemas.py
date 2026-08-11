from pydantic import BaseModel, Field
from typing import Optional, List, Dict

# BASE: todos opcionales excepto nombre y dni
class EmpleadoBase(BaseModel):
    nombre: str
    dni: str

    apellidos: Optional[str] = None
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

    modulos_visibles: List[str] = Field(default_factory=list)
    permisos_modulo: Dict[str, List[str]] = Field(default_factory=dict)

# CREATE: solo pedimos nombre y dni
class EmpleadoCreate(BaseModel):
    nombre: str
    dni: str

# UPDATE: todos opcionales
class EmpleadoUpdate(BaseModel):
    nombre: Optional[str] = None
    dni: Optional[str] = None
    apellidos: Optional[str] = None
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
    modulos_visibles: Optional[List[str]] = None
    permisos_modulo: Optional[Dict[str, List[str]]] = None
    usuario: Optional[str] = None
    password: Optional[str] = None

class EmpleadoResponse(EmpleadoBase):
    id: int
    usuario: str
    activo: bool

    class Config:
        orm_mode = True
