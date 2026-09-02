from pydantic import BaseModel
from datetime import datetime

class MensajeBase(BaseModel):
    remitente_id: int
    destinatario_id: int
    contenido: str

class MensajeCreate(MensajeBase):
    pass

class MensajeResponse(MensajeBase):
    id: int
    fecha: datetime
    leido: bool

    model_config = {
        "from_attributes": True
    }
