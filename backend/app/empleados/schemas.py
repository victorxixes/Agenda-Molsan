from pydantic import BaseModel
from typing import Optional, List, Dict

class EmpleadoBase(BaseModel):
    nombre: Optional[str]
    apellidos: Optional[str]
    dni: Optional[str]
    telefono: Optional[str]
    email_personal: Optional[str]
    email_empresa: Optional[str]
    extension: Optional[str]
    usuario: Optional[str]
    password: Optional[str]

    direccion: Optional[str]
    fecha_nacimiento: Optional[str]
    alergias: Optional[str]
    persona_contacto: Optional[str]
    telefono_contacto: Optional[str]
    observaciones: Optional[str]
    foto: Optional[str]

    departamento_id: Optional[int]
    seccion_id: Optional[int]
    cargo_id: Optional[int]
    rol_id: Optional[int]

    fecha_alta: Optional[str]
    fecha_baja: Optional[str]
    activo: Optional[bool]

    modulos_visibles_list: Optional[List[str]] = []
    permisos_modulo_dict: Optional[Dict] = {}

class EmpleadoCreate(EmpleadoBase):
    pass

class Empleado(EmpleadoBase):
    id: int

    class Config:
        orm_mode = True
