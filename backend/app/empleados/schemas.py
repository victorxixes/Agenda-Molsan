from pydantic import BaseModel
from typing import Optional


# =========================================================
# LOGIN
# =========================================================
class LoginEmpleado(BaseModel):
    usuario: str
    password: str


# =========================================================
# BASE (solo campos seguros y serializables)
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
# UPDATE (solo campos editables)
# =========================================================
class EmpleadoUpdate(BaseModel):
    nombre: Optional[str] = None
    apellidos: Optional[str] = None
    telefono: Optional[str] = None
    email_empresa: Optional[str] = None
    activo: Optional[bool] = None


# =========================================================
# RESPONSE COMPLETO
# =========================================================
class Empleado(EmpleadoBase):
    pass
