from pydantic import BaseModel
from datetime import datetime

class MensajeBase(BaseModel):
    remitente_id: int
    destinatario_id: int
    mensaje: str

class MensajeCreate(MensajeBase):
    pass

class MensajeResponse(MensajeBase):
    id: int
    fecha: datetime
    leido: bool

    model_config = {
        "from_attributes": True
    }


class UsuarioEstadoBase(BaseModel):
    usuario_id: int
    conectado: bool

class UsuarioEstadoResponse(UsuarioEstadoBase):
    id: int
    ultima_actividad: datetime

    model_config = {
        "from_attributes": True
    }
