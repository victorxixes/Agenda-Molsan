from pydantic import BaseModel
from datetime import datetime

class LogBase(BaseModel):
    evento: str
    detalle: str | None = None
    ip: str | None = None

class LogOut(LogBase):
    id: int
    fecha: datetime

    class Config:
        orm_mode = True
