from pydantic import BaseModel

class RolBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class RolCreate(RolBase):
    pass

class RolOut(RolBase):
    id: int

    class Config:
        orm_mode = True
