from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# ---------------------------------------------------------
# BASE
# ---------------------------------------------------------
class MensajeBase(BaseModel):
    remitente_id: int
    destinatario_id: int
    contenido: Optional[str] = None
    archivo_url: Optional[str] = None


# ---------------------------------------------------------
# CREATE (REST)
# ---------------------------------------------------------
class MensajeCreate(MensajeBase):
    pass


# ---------------------------------------------------------
# RESPONSE
# ---------------------------------------------------------
class MensajeResponse(MensajeBase):
    id: int
    fecha: datetime
    leido: bool

    model_config = {
        "from_attributes": True
    }
