from pydantic import BaseModel

class InformeFila(BaseModel):
    apoderado_id: int
    nombre: str
    presencial: int
    vc: int
    km: float
