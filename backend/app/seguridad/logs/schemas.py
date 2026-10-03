from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ============================================================
# CREAR LOG
# ============================================================

class LogCreate(BaseModel):
    evento: str
    detalle: Optional[str] = None
    ip: Optional[str] = None


# ============================================================
# RESPUESTA
# ============================================================

class LogOut(BaseModel):
    id: int
    evento: str
    detalle: Optional[str] = None
    ip: Optional[str] = None
    fecha: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
