from pydantic import BaseModel

class DepartamentoBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class DepartamentoCreate(DepartamentoBase):
    pass

class Departamento(DepartamentoBase):
    id: int

    class Config:
        orm_mode = True


class SeccionBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class SeccionCreate(SeccionBase):
    pass

class Seccion(SeccionBase):
    id: int

    class Config:
        orm_mode = True


class CargoBase(BaseModel):
    nombre: str
    descripcion: str | None = None

class CargoCreate(CargoBase):
    pass

class Cargo(CargoBase):
    id: int

    class Config:
        orm_mode = True
