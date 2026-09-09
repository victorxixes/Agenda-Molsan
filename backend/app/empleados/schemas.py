from pydantic import BaseModel
from typing import Optional


# =========================================================
# LOGIN
# =========================================================
class LoginEmpleado(BaseModel):
    usuario: str
    password: str


# =========================================================
# BASE (campos seguros y serializables)
# =========================================================
class EmpleadoBase(BaseModel):
    id: int
    nombre: Optional[str] = None
    apellidos: Optional[str] = None
    telefono: Optional[str] = None
    email_empresa: Optional[str] = None
    activo: Optional[bool] = True

    class Config:
        orm_mode = True


# =========================================================
# CREATE
# =========================================================
class EmpleadoCreate(BaseModel):
    nombre: str
    dni: str
    usuario: str
    password: str


# =========================================================
# UPDATE (TODOS los campos editables)
# =========================================================
class EmpleadoUpdate(BaseModel):
    # Datos básicos
    nombre: Optional[str] = None
    apellidos: Optional[str] = None
    dni: Optional[str] = None
    telefono: Optional[str] = None
    email_personal: Optional[str] = None
    email_empresa: Optional[str] = None
    extension: Optional[str] = None
    usuario: Optional[str] = None

    # Datos personales
    direccion: Optional[str] = None
    codigo_postal: Optional[str] = None
    poblacion: Optional[str] = None
    provincia: Optional[str] = None
    fecha_nacimiento: Optional[str] = None
    alergias: Optional[str] = None
    persona_contacto: Optional[str] = None
    telefono_contacto: Optional[str] = None
    observaciones: Optional[str] = None

    # Datos laborales
    departamento_id: Optional[int] = None
    seccion_id: Optional[int] = None
    cargo_id: Optional[int] = None
    fecha_alta: Optional[str] = None
    fecha_baja: Optional[str] = None

    # Estado
    activo: Optional[bool] = None


# =========================================================
# RESPONSE COMPLETO
# =========================================================
class Empleado(EmpleadoBase):
    pass
