from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AuditoriaBase(BaseModel):
    usuario: Optional[str] = None
    modulo: Optional[str] = None
    accion: Optional[str] = None
    descripcion: Optional[str] = None
    ip: Optional[str] = None

class AuditoriaOut(AuditoriaBase):
    id: int
    fecha: datetime

    model_config = {
        "from_attributes": True
    }
