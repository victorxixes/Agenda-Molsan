from pydantic import BaseModel
from datetime import datetime

class DocumentoBase(BaseModel):
    titulo: str
    concepto: str | None = None
    fichero: str
    usuario_id: int

class DocumentoCreate(DocumentoBase):
    pass

class DocumentoResponse(DocumentoBase):
    id: int
    fecha_publicacion: datetime

    model_config = {
        "from_attributes": True
    }
