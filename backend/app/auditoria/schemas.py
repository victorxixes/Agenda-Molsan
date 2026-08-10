from pydantic import BaseModel
from datetime import datetime

class AuditoriaBase(BaseModel):
    usuario: str | None = None
    modulo: str | None = None
    accion: str | None = None
    descripcion: str | None = None

class AuditoriaCreate(AuditoriaBase):
    pass

class AuditoriaOut(AuditoriaBase):
    id: int
    fecha: datetime

    class Config:
        orm_mode = True
