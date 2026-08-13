from pydantic import BaseModel, validator
from datetime import date, time

class CitaCreate(BaseModel):
    fecha: date
    hora_inicio: time
    hora_fin: time
    tipo_cita: str

    notario_id: Optional[int] = None
    tipo_firma: Optional[str] = None
    apoderado_id: Optional[int] = None
    observaciones: Optional[str] = None

    estado: Optional[str] = "Pendiente"

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


class CitaUpdate(BaseModel):
    fecha: date | None = None
    hora_inicio: time | None = None
    hora_fin: time | None = None

    tipo_cita: str | None = None
    notario_id: int | None = None
    tipo_firma: str | None = None

    apoderado_id: int | None = None

    estado: str | None = None
    observaciones: str | None = None


class CitaResponse(CitaBase):
    id: int

    model_config = {
        "from_attributes": True
    }
