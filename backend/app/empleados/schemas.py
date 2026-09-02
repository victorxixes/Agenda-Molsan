from pydantic import BaseModel
from typing import Optional, List, Dict

class EmpleadoBase(BaseModel):
    nombre: Optional[str] = None
    apellidos: Optional[str] = None
    dni: Optional[str] = None
    telefono: Optional[str] = None
    email_personal: Optional[str] = None
    email_empresa: Optional[str] = None
    extension: Optional[str] = None
    usuario: Optional[str] = None
    password: Optional[str] = None

    direccion: Optional[str] = None
    codigo_postal: Optional[str] = None
    poblacion: Optional[str] = None
    provincia: Optional[str] = None
    fecha_nacimiento: Optional[str] = None
    alergias: Optional[str] = None
    persona_contacto: Optional[str] = None
    telefono_contacto: Optional[str] = None
    observaciones: Optional[str] = None
    foto: Optional[str] = None

    departamento_id: Optional[int] = None
    seccion_id: Optional[int] = None
    cargo_id: Optional[int] = None
    rol_id: Optional[int] = None

    fecha_alta: Optional[str] = None
    fecha_baja: Optional[str] = None
    activo: Optional[bool] = True

    modulos_visibles_list: Optional[List[str]] = []
    permisos_modulo_dict: Optional[Dict] = {}

class EmpleadoCreate(BaseModel):
    nombre: str
    dni: str
    usuario: str
    password: str

class EmpleadoUpdate(EmpleadoBase):
    pass

class Empleado(EmpleadoBase):
    id: int

    class Config:
        orm_mode = True
