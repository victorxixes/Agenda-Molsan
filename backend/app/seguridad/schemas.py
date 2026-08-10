from pydantic import BaseModel

class PermisoBase(BaseModel):
    modulo: str
    acciones: str  # "ver,crear,editar,eliminar"

class PermisoOut(PermisoBase):
    id: int
    class Config:
        orm_mode = True

class RolBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class RolCreate(RolBase):
    permisos: list[PermisoBase]

class RolOut(RolBase):
    id: int
    permisos: list[PermisoOut]
    class Config:
        orm_mode = True
