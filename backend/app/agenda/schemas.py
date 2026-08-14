from pydantic import BaseModel, validator
from datetime import date, time
from typing import Optional

# -------------------------
# BASE
# -------------------------
class CitaBase(BaseModel):
    fecha: date
    hora_inicio: time
    hora_fin: time
    tipo_cita: str

    notario_id: Optional[int] = None
    tipo_firma: Optional[str] = None

    # CAMBIO IMPORTANTE → ahora es STRING
    apoderado: Optional[str] = None

    observaciones: Optional[str] = None
    estado: Optional[str] = "Pendiente"


# -------------------------
# CREATE
# -------------------------
class CitaCreate(CitaBase):

    @validator("notario_id")
    def validar_notario(cls, v, values):
        tipo = (values.get("tipo_cita") or "").lower()
        if "firma" in tipo and v is None:
            raise ValueError("El campo notario_id es obligatorio para citas de firma")
        return v

    @validator("tipo_firma")
    def validar_tipo_firma(cls, v, values):
        tipo = (values.get("tipo_cita") or "").lower()
        if "firma" in tipo and not v:
            raise ValueError("El campo tipo_firma es obligatorio para citas de firma")
        return v


# -------------------------
# UPDATE
# -------------------------
class CitaUpdate(BaseModel):
    fecha: Optional[date] = None
    hora_inicio: Optional[time] = None
    hora_fin: Optional[time] = None

    tipo_cita: Optional[str] = None
    notario_id: Optional[int] = None
    tipo_firma: Optional[str] = None

    # CAMBIO IMPORTANTE → ahora es STRING
    apoderado: Optional[str] = None

    estado: Optional[str] = None
    observaciones: Optional[str] = None


# -------------------------
# RESPONSE
# -------------------------
class CitaResponse(CitaBase):
    id: int

    class Config:
        orm_mode = True
