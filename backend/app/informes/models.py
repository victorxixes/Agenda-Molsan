from pydantic import BaseModel

class InformeApoderado(BaseModel):
    apoderado_id: int
    nombre: str
    presencial: int
    vc: int
    km: float

class InformeTabla(BaseModel):
    apoderado_id: int
    nombre: str
    presencial: int
    vc: int
    km: float
