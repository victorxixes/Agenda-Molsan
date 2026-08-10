from pydantic import BaseModel
from typing import Optional, List, Dict
from app.maestros.schemas import Departamento, Seccion, Cargo

class EmpleadoBase(BaseModel):
    nombre: str
    apellidos: str
    dni: str | None = None
    telefono: str | None = None
    email_personal: str | None = None
    direccion: str | None = None
    fecha_nacimiento: str | None = None

    departamento_id: int | None = None
    seccion_id: int | None = None
    cargo_id: int | None = None

    email_empresa: str | None = None
    extension: str | None = None
    fecha_alta: str | None = None
    fecha_baja: str | None = None

    alergias: str | None = None
    persona_contacto: str | None = None
    telefono_contacto: str | None = None
    observaciones: str | None = None

    foto: str | None = None
    foto_url: str | None = None

    modulos_visibles: List[str] = []
    permisos_modulo: Dict[str, List[str]] = {}

class EmpleadoCreate(BaseModel):
    nombre: str
    apellidos: str
    usuario: str
    password: str
    modulos_visibles: Optional[List[str]] = []
    permisos_modulo: Optional[Dict[str, List[str]]] = {}

class Empleado(EmpleadoBase):
    id: int
    usuario: str
    activo: bool

    departamento: Departamento | None = None
    seccion: Seccion | None = None
    cargo: Cargo | None = None

    class Config:
        orm_mode = True
