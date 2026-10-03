from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# ============================================================
# SEGURIDAD — AUDITORÍA SCHEMAS
# MOLSAN ERP SAAS
# ============================================================


# ============================================================
# BASE
# ============================================================

class AuditoriaBase(BaseModel):
    """
    Campos comunes de un registro de auditoría.
    """

    usuario: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    modulo: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    accion: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    descripcion: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    ip: Optional[str] = Field(
        default=None,
        max_length=50,
    )


# ============================================================
# CREAR
# ============================================================

class AuditoriaCreate(AuditoriaBase):
    """
    Datos necesarios para crear un registro de auditoría.

    Se mantienen todos los campos opcionales porque la auditoría
    también puede registrar eventos generados por el sistema
    donde alguno de los datos no esté disponible.
    """

    pass


# ============================================================
# SALIDA
# ============================================================

class AuditoriaOut(AuditoriaBase):
    """
    Registro de auditoría devuelto por la API.
    """

    id: int

    fecha: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
