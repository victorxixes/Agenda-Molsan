from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(
        from_attributes=True
    )
