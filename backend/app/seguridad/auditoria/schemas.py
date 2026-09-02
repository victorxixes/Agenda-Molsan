from pydantic import BaseModel
from datetime import datetime

class AuditoriaBase(BaseModel):
    usuario: str | None = None
    modulo: str | None = None
    accion: str | None = None
    descripcion: str | None = None
    ip: str | None = None

class AuditoriaOut(AuditoriaBase):
    id: int
    fecha: datetime

    class Config:
        orm_mode = True
