from pydantic import BaseModel
from typing import List, Optional


# =========================================================
# AGENDA — Próximas citas
# =========================================================
class CitaProxima(BaseModel):
    fecha: str
    notario: Optional[str]
    apoderado: Optional[str]
    tipo_firma: str          # ✔ siempre existe en tu service
    hora_inicio: str
    hora_fin: str


# =========================================================
# RUTAS — Tramos y ruta completa
# =========================================================
class TramoRuta(BaseModel):
    desde: str
    hasta: str
    km: float


class RutaCompleta(BaseModel):
    distancia_total_km: float
    tramos: List[TramoRuta]

    class Config:
        extra = "allow"

# =========================================================
# APODERADOS — Ranking
# =========================================================
class ApoderadoRanking(BaseModel):
    apoderado_id: int
    nombre: str
    firmas_presencial: int
    km_por_cita: List[float]
    km_total: float
    ruta_completa: Optional[RutaCompleta]


# =========================================================
# AGENDA — Resumen del día
# =========================================================
class DashboardAgenda(BaseModel):
    presencial_hoy: int
    vc_hoy: int
    proximas: List[CitaProxima]


# =========================================================
# CTN — Resumen
# =========================================================
class DashboardCTN(BaseModel):
    presencial_total: int
    vc_total: int


# =========================================================
# APODERADOS — Resumen
# =========================================================
class DashboardApoderados(BaseModel):
    ranking: List[ApoderadoRanking]
    km_total: float


# =========================================================
# DASHBOARD — Respuesta completa
# =========================================================
class DashboardResponse(BaseModel):
    agenda: DashboardAgenda
    ctn: DashboardCTN
    apoderados: DashboardApoderados
