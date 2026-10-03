from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AuditoriaBase(BaseModel):
    usuario: Optional[str] = None
    modulo: Optional[str] = None
    accion: Optional[str] = None
    descripcion: Optional[str] = None
    ip: Optional[str] = None


class AuditoriaOut(AuditoriaBase):
    id: int
    fecha: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )
