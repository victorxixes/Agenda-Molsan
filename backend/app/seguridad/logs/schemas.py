from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# SEGURIDAD — LOGS SCHEMAS
# MOLSAN ERP SAAS PREMIUM 2027
# ============================================================


# ============================================================
# CREAR LOG
# ============================================================


class LogCreate(BaseModel):
    """
    Datos necesarios para registrar un log.

    La IP puede omitirse porque el router intentará
    obtenerla directamente de la petición.
    """

    evento: str = Field(
        ...,
        min_length=1,
        max_length=200,
    )

    detalle: Optional[str] = Field(
        default=None,
        max_length=1000,
    )

    ip: Optional[str] = Field(
        default=None,
        max_length=50,
    )


# ============================================================
# SALIDA
# ============================================================


class LogOut(BaseModel):
    """
    Representación pública de un log.
    """

    id: int

    evento: str

    detalle: Optional[str] = None

    ip: Optional[str] = None

    fecha: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )
