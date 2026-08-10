from pydantic import BaseModel

class InformeAgenda(BaseModel):
    total_citas: int
    citas_confirmadas: int
    citas_finalizadas: int
    citas_canceladas: int

class InformeApoderado(BaseModel):
    apoderado_id: int
    nombre: str
    total_citas: int
    finalizadas: int
    canceladas: int

class ZonaCalor(BaseModel):
    zona: str
    total_visitas: int
