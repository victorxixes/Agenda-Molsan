from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from backend.app.dashboard.service import obtener_dashboard
from backend.app.dashboard.schemas import DashboardResponse

from backend.app.database import get_db
from backend.app.agenda.service import (
    listar_citas_dia,
    listar_citas_semana,
    listar_citas_mes
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# ---------------------------------------------------------
# DASHBOARD EXTENDIDO (usa los schemas y el service limpio)
# ---------------------------------------------------------
@router.get("/extendido", response_model=DashboardResponse)
def dashboard_extendido(db: Session = Depends(get_db)):
    return obtener_dashboard(db)


# ---------------------------------------------------------
# DASHBOARD SIMPLE (sin rutas, sin km, sin geocode)
# ---------------------------------------------------------
@router.get("/")
def dashboard(db: Session = Depends(get_db)):
    hoy = date.today()
    year = hoy.year
    month = hoy.month

    citas_hoy = listar_citas_dia(db, hoy)          # ahora dicts
    citas_semana = listar_citas_semana(db, hoy)    # ahora dicts
    citas_mes = listar_citas_mes(db, year, month)  # ahora dicts

    total_firmas = len([c for c in citas_mes if c.get("tipo_cita") == "Firma notarial"])
    total_vc = len([c for c in citas_mes if c.get("vc") == "SI"])
    total_presencial = len([c for c in citas_mes if c.get("vc") == "NO"])

    proximas_raw = sorted(citas_hoy, key=lambda c: c.get("hora_inicio"))[:5]

    proximas = []
    for c in proximas_raw:
        
        # Construir nombre completo del apoderado
        apoderado = None
        if c.get("apoderado_nombre"):
            apoderado = f"{c.get('apoderado_nombre')} {c.get('apoderado_apellidos')}"
        
        proximas.append({
            "fecha": c.get("fecha"),
            "notario": c.get("notario_nombre"),
            "apoderado": apoderado,
            "tipo_firma": "VC" if c.get("vc") == "SI" else "Presencial",
            "hora_inicio": c.get("hora_inicio"),
            "hora_fin": c.get("hora_fin")
        })

    return {
        "hoy": len(citas_hoy),
        "semana": len(citas_semana),
        "mes": len(citas_mes),

        "firmas_mes": total_firmas,
        "vc_mes": total_vc,
        "presenciales_mes": total_presencial,

        "proximas": proximas
    }

