from pydantic import BaseModel
from typing import Optional

# -----------------------------
# CREATE
# -----------------------------
class EmpleadoCreate(BaseModel):
    nombre: str
    dni: str

# -----------------------------
# UPDATE (versión v2)
# -----------------------------
class EmpleadoUpdate(BaseModel):
    nombre: Optional[str] = None
    dni: Optional[str] = None
    usuario: Optional[str] = None
    password: Optional[str] = None
    activo: Optional[bool] = None

# -----------------------------
# RESPONSE
# -----------------------------
class EmpleadoResponse(BaseModel):
    id: int
    nombre: str
    dni: str
    usuario: str
    activo: bool

    class Config:
        orm_mode = True
