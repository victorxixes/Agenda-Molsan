from pydantic import BaseModel


# ============================================================
# ROL BASE
# ============================================================

class RolBase(BaseModel):
    nombre: str
    descripcion: str | None = None


# ============================================================
# CREAR ROL
# ============================================================

class RolCreate(RolBase):
    pass


# ============================================================
# SALIDA ROL
# ============================================================

class RolOut(RolBase):
    id: int

    class Config:
        orm_mode = True
