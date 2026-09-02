from pydantic import BaseModel
from typing import Optional

class MaestroBase(BaseModel):
    nombre: Optional[str] = None

class MaestroCreate(BaseModel):
    nombre: str

class MaestroUpdate(MaestroBase):
    pass

class Departamento(MaestroBase):
    id: int
    class Config:
        orm_mode = True

class Seccion(MaestroBase):
    id: int
    class Config:
        orm_mode = True

class Cargo(MaestroBase):
    id: int
    class Config:
        orm_mode = True

class Rol(MaestroBase):
    id: int
    class Config:
        orm_mode = True
