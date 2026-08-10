from pydantic import BaseModel, validator
from datetime import date, time

class CitaBase(BaseModel):
    fecha: date
    hora_inicio: time
    hora_fin: time

    tipo_cita: str  # Texto libre desde el frontend

    # notario_id opcional
    notario_id: int | None = None

    tipo_firma: str | None = None

    # apoderado_id también opcional
    apoderado_id: int | None = None

    estado: str = "Pendiente"
    observaciones: str | None = None

    @validator("notario_id")
    def validar_notario(cls, v, values):
        tipo = (values.get("tipo_cita") or "").lower()

        # Si la cita es de firma, el notario es obligatorio
        if "firma" in tipo and v is None:
            raise ValueError("El campo notario_id es obligatorio para citas de firma")

        return v


class CitaCreate(CitaBase):
    pass


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

    @validator("notario_id")
    def validar_notario_update(cls, v, values):
        tipo = (values.get("tipo_cita") or "").lower()

        if "firma" in tipo and v is None:
            raise ValueError("El campo notario_id es obligatorio para citas de firma")

        return v


class CitaResponse(CitaBase):
    id: int

    model_config = {
        "from_attributes": True
    }
