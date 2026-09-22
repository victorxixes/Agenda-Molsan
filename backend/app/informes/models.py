from pydantic import BaseModel

class InformeFila(BaseModel):
    apoderado_id: str | int
    nombre: str
    vc: int
    presencial: int
    km: float

class InformeIndividual(BaseModel):
    total_vc: int
    total_presencial: int
    km_totales: float
    tiempo_medio_dias: float
