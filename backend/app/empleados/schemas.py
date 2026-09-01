from pydantic import BaseModel, Field
from typing import Optional, Dict, List

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

    rol_id: Optional[int] = None

    email_empresa: Optional[str] = None
    extension: Optional[str] = None
    fecha_alta: Optional[str] = None
    fecha_baja: Optional[str] = None

    activo: Optional[bool] = True

    usuario: Optional[str] = None
    password: Optional[str] = None

    foto: Optional[str] = None

    # JSONB — nombres correctos según tu modelo SQLAlchemy
    modulos_visibles_list: Optional[List[str]] = Field(default_factory=list)
    permisos_modulo_dict: Optional[Dict[str, List[str]]] = Field(default_factory=dict)


class EmpleadoCreate(EmpleadoBase):
    # ⭐ Obligatorios
    nombre: str
    dni: str
    usuario: str
    password: str


class EmpleadoUpdate(EmpleadoBase):
    pass


class EmpleadoResponse(EmpleadoBase):
    id: int
    rol_nombre: Optional[str] = None

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True


class EmpleadoSearchResponse(BaseModel):
    total: int
    page: int
    pages: int
    limit: int
    offset: int
    items: list[EmpleadoResponse]
