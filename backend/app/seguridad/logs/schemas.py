from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ============================================================
# LOG - CREACIÓN
# ============================================================

class LogCreate(BaseModel):
    """
    Datos necesarios para registrar un nuevo log.
    """

    evento: str
    detalle: Optional[str] = None
    ip: Optional[str] = None


# ============================================================
# LOG - SALIDA
# ============================================================

class LogOut(BaseModel):
    """
    Representación de un log devuelto por la API.
    """

    id: int
    evento: str
    detalle: Optional[str] = None
    ip: Optional[str] = None
    fecha: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
