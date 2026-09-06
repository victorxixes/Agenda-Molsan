from pydantic import BaseModel, validator
from datetime import date, time
from typing import Optional


class CitaBase(BaseModel):
    fecha: date
    hora_inicio: time
    hora_fin: time

    tipo_cita: str

    notario_id: Optional[int] = None
    tipo_firma: Optional[str] = None

    apoderado_id: Optional[int] = None
    observaciones: Optional[str] = None
    estado: Optional[str] = "Pendiente"

    @validator("tipo_cita")
    def validar_tipo_cita(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("tipo_cita debe ser un texto válido")
        return v

    @validator("notario_id")
    def validar_notario_si_firma(cls, v, values):
        if values.get("tipo_cita") == "Firma notarial" and v is None:
            raise ValueError("notario_id es obligatorio para tipo_cita = Firma notarial")
        return v


class CitaCreate(CitaBase):
    pass


class CitaUpdate(BaseModel):
    fecha: Optional[date] = None
    hora_inicio: Optional[time] = None
    hora_fin: Optional[time] = None

    tipo_cita: Optional[str] = None
    notario_id: Optional[int] = None
    tipo_firma: Optional[str] = None

    apoderado_id: Optional[int] = None
    observaciones: Optional[str] = None
    estado: Optional[str] = None


class NotarioResponse(BaseModel):
    id: int
    nombre: str
    apellidos: Optional[str] = None
    vc: Optional[str] = None
    apoderado_id: Optional[int] = None
    apoderado_s: Optional[str] = None
    observacion: Optional[str] = None

    class Config:
        orm_mode = True


class ApoderadoResponse(BaseModel):
    id: int
    nombre: str
    apellidos: Optional[str] = None

    class Config:
        orm_mode = True


class CitaResponse(CitaBase):
    id: int

    notario: Optional[NotarioResponse] = None
    apoderado: Optional[ApoderadoResponse] = None

    class Config:
        orm_mode = True
