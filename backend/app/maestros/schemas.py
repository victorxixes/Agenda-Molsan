from pydantic import BaseModel

# ---------------------------------------------------------
# DEPARTAMENTO
# ---------------------------------------------------------

class DepartamentoBase(BaseModel):
    nombre: str
    descripcion: str | None = None   # ✔ existe en el modelo SQLAlchemy

class DepartamentoCreate(DepartamentoBase):
    pass

class Departamento(DepartamentoBase):
    id: int

    class Config:
        orm_mode = True


# ---------------------------------------------------------
# SECCION
# ---------------------------------------------------------

class SeccionBase(BaseModel):
    nombre: str   # ✔ único campo real del modelo

class SeccionCreate(SeccionBase):
    pass

class Seccion(SeccionBase):
    id: int

    class Config:
        orm_mode = True


# ---------------------------------------------------------
# CARGO
# ---------------------------------------------------------

class CargoBase(BaseModel):
    nombre: str   # ✔ único campo real del modelo

class CargoCreate(CargoBase):
    pass

class Cargo(CargoBase):
    id: int

    class Config:
        orm_mode = True
