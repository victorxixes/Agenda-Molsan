from pydantic import BaseModel
from typing import List, Optional


class CitaProxima(BaseModel):
    fecha: str
    notario: Optional[str]
    apoderado: Optional[str]
    tipo_firma: Optional[str]
    hora_inicio: str
    hora_fin: str


class TramoRuta(BaseModel):
    desde: str
    hasta: str
    km: float


class RutaCompleta(BaseModel):
    distancia_total_km: float
    tramos: List[TramoRuta]


class ApoderadoRanking(BaseModel):
    apoderado_id: int
    nombre: str
    firmas_presencial: int
    km_por_cita: List[float]
    km_total: float
    ruta_completa: Optional[RutaCompleta]


class DashboardAgenda(BaseModel):
    presencial_hoy: int
    vc_hoy: int
    proximas: List[CitaProxima]


class DashboardCTN(BaseModel):
    presencial_total: int
    vc_total: int


class DashboardApoderados(BaseModel):
    ranking: List[ApoderadoRanking]
    km_total: float


class DashboardResponse(BaseModel):
    agenda: DashboardAgenda
    ctn: DashboardCTN
    apoderados: DashboardApoderados
