from pydantic import BaseModel
from typing import List, Optional

# =========================================================
# AGENDA — Próximas citas
# =========================================================
class CitaProxima(BaseModel):
    fecha: str
    notario: Optional[str]
    apoderado: Optional[str]
    tipo_firma: str
    hora_inicio: str
    hora_fin: str


# =========================================================
# APODERADOS — Ranking (SIN KM, SIN RUTAS)
# =========================================================
class ApoderadoRanking(BaseModel):
    apoderado_id: int
    nombre: str
    firmas_presencial: int
    km_por_cita: List[float]     # ahora siempre []
    km_total: float              # ahora siempre 0
    ruta_completa: Optional[dict] = None  # ahora siempre None


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
