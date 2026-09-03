from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LogBase(BaseModel):
    evento: str
    detalle: Optional[str] = None
    ip: Optional[str] = None

class LogOut(LogBase):
    id: int
    fecha: datetime

    model_config = {
        "from_attributes": True
    }
