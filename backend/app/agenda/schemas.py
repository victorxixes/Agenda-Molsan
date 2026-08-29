from pydantic import BaseModel, validator
from datetime import date, time
from typing import Optional

# =========================================================
# BASE (solo columnas reales de la tabla)
# =========================================================
class CitaBase(BaseModel):
    fecha: date
    hora_inicio: time
    hora_fin: time
    tipo_cita: str

    notario_id: Optional[int] = None
    tipo_firma: Optional[str] = None

    apoderado_id: Optional[int] = None  # ✅ AÑADIDO

    observaciones: Optional[str] = None


# =========================================================
# CREATE (el apoderado se asigna automáticamente)
# =========================================================
class CitaCreate(CitaBase):

    @validator("notario_id")
    def validar_notario(cls, v, values):
        tipo = (values.get("tipo_cita") or "").lower()
        if tipo.startswith("firma") and v is None:
            raise ValueError("El campo notario_id es obligatorio para citas de firma")
        return v

    @validator("tipo_firma")
    def validar_tipo_firma(cls, v, values):
        tipo = (values.get("tipo_cita") or "").lower()
        if tipo.startswith("firma") and not v:
            raise ValueError("El campo tipo_firma es obligatorio para citas de firma")
        return v


# =========================================================
# UPDATE (no se permite cambiar apoderado)
# =========================================================
class CitaUpdate(BaseModel):
    fecha: Optional[date] = None
    hora_inicio: Optional[time] = None
    hora_fin: Optional[time] = None

    tipo_cita: Optional[str] = None
    notario_id: Optional[int] = None
    tipo_firma: Optional[str] = None

    apoderado_id: Optional[int] = None  # ✅ AÑADIDO

    observaciones: Optional[str] = None


# =========================================================
# RESPONSE (incluye relaciones completas)
# =========================================================
class NotarioResponse(BaseModel):
    id: int
    nombre: str
    apellidos: str
    direccion: Optional[str] = None
    vc: Optional[str] = None
    observacion: Optional[str] = None
    apoderado_id: Optional[int] = None

    class Config:
        orm_mode = True


class ApoderadoResponse(BaseModel):
    id: int
    nombre: str
    apellidos: str

    class Config:
        orm_mode = True


class CitaResponse(CitaBase):
    id: int

    notario: Optional[NotarioResponse] = None
    apoderado: Optional[ApoderadoResponse] = None  # ✅ objeto completo
    apoderado_id: Optional[int] = None

    class Config:
        orm_mode = True
