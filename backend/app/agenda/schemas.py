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

    # ✔ Ahora permite None
    notario_id: Optional[int] = None
    vc: Optional[str] = None

    # ✔ Ahora permite None (antes causaba 422)
    apoderado_id: Optional[int] = None

    observacion: Optional[str] = None

    @validator("tipo_cita")
    def validar_tipo_cita(cls, v):
        tipos_validos = ["Firma notarial", "Reunión", "Otros"]
        if v not in tipos_validos:
            raise ValueError("tipo_cita debe ser: Firma notarial, Reunión u Otros")
        return v

    @validator("notario_id")
    def validar_notario_si_firma(cls, v, values):
        if values.get("tipo_cita") == "Firma notarial" and v is None:
            raise ValueError("notario_id es obligatorio para tipo_cita = Firma notarial")
        return v


# =========================================================
# CREATE
# =========================================================
class CitaCreate(CitaBase):

    @validator("notario_id")
    def validar_notario(cls, v, values):
        tipo = (values.get("tipo_cita") or "").lower()
        if tipo.startswith("firma") and v is None:
            raise ValueError("El campo notario_id es obligatorio para citas de firma")
        return v

    @validator("vc")
    def validar_vc(cls, v, values):
        tipo = (values.get("tipo_cita") or "").lower()
        if tipo.startswith("firma") and not v:
            raise ValueError("El campo vc es obligatorio para citas de firma")
        return v


# =========================================================
# UPDATE
# =========================================================
class CitaUpdate(BaseModel):
    fecha: Optional[date] = None
    hora_inicio: Optional[time] = None
    hora_fin: Optional[time] = None

    tipo_cita: Optional[str] = None
    notario_id: Optional[int] = None
    vc: Optional[str] = None

    apoderado_id: Optional[int] = None
    observacion: Optional[str] = None


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
    apellidos: Optional[str] = None

    class Config:
        orm_mode = True


class CitaResponse(CitaBase):
    id: int

    notario: Optional[NotarioResponse] = None
    apoderado: Optional[ApoderadoResponse] = None

    apoderado_s: Optional[str] = None
    estado: Optional[str] = None

    class Config:
        orm_mode = True
