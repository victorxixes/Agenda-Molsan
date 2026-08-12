from pydantic import BaseModel
from datetime import datetime

class NoticiaBase(BaseModel):
    titulo: str
    descripcion: str
    fichero: str | None = None
    usuario_id: int | None = None

class NoticiaCreate(NoticiaBase):
    pass

class NoticiaResponse(NoticiaBase):
    id: int
    fecha_publicacion: datetime

    model_config = {
        "from_attributes": True
    }
