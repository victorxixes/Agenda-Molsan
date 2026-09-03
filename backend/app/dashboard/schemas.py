from pydantic import BaseModel
from typing import List, Optional


class CitaProxima(BaseModel):
    fecha: str
    notario: Optional[str]
    apoderado: Optional[str]
    tipo_firma: Optional[str]
    hora_inicio: str
    hora_fin: str


class DashboardAgenda(BaseModel):
    presencial_hoy: int
    vc_hoy: int
    proximas: List[CitaProxima]


class DashboardCTN(BaseModel):
    presencial_total: int
    vc_total: int


class DashboardApoderados(BaseModel):
    ranking: List[dict]
    presencial: int
    vc: int
    km_recorridos: float


class DashboardResponse(BaseModel):
    agenda: DashboardAgenda
    ctn: DashboardCTN
    apoderados: DashboardApoderados
