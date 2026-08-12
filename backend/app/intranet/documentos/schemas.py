from pydantic import BaseModel
from datetime import datetime

class DocumentoBase(BaseModel):
    titulo: str
    concepto: str | None = None
    usuario_id: int | None = None

class DocumentoCreate(DocumentoBase):
    pass

class DocumentoResponse(DocumentoBase):
    id: int
    fichero: str
    fecha_publicacion: datetime

    model_config = {
        "from_attributes": True
    }
