from pydantic import BaseModel
from datetime import datetime
from typing import Any

class LogBase(BaseModel):
    usuario_id: int | None = None
    modulo: str
    accion: str
    descripcion: str
    datos: Any | None = None
    nivel: str = "INFO"

class LogCreate(LogBase):
    pass

class LogResponse(LogBase):
    id: int
    fecha: datetime

    model_config = {
        "from_attributes": True
    }
