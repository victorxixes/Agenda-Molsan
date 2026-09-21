from fastapi import APIRouter, Query
from datetime import date
from database import db  # tu wrapper habitual
from typing import List, Dict, Any

router = APIRouter(prefix="/informes", tags=["Informes"])


# ---------------------------------------------------------
# INFORME POR APODERADO (mensual / anual)
# ---------------------------------------------------------
@router.get("/apoderados/{apoderado_id}")
def informe_apoderado(
    apoderado_id: int,
    desde: date = Query(...),
    hasta: date = Query(...)
):
    """
    Informe detallado para un apoderado:
    - Nº citas presenciales
    - Nº citas por videoconferencia
    - Km recorridos en citas presenciales
    - Tiempo medio entre citas
    """

    citas: List[Dict[str, Any]] = db.fetch("""
        SELECT fecha, tipo_firma, km
        FROM citas
        WHERE apoderado_id = :id
        AND fecha BETWEEN :desde AND :hasta
        ORDER BY fecha ASC
    """, {"id": apoderado_id, "desde": desde, "hasta": hasta})

    # -----------------------------
    # Cálculos
    # -----------------------------
    total_presencial = sum(1 for c in citas if c["tipo_firma"] == "P")
    total_vc = sum(1 for c in citas if c["tipo_firma"] == "VC")
    km_totales = sum(c["km"] for c in citas if c["tipo_firma"] == "P")

    # Tiempo medio entre citas
    fechas = [c["fecha"] for c in citas]
    fechas.sort()

    diferencias = []
    for i in range(1, len(fechas)):
        diff = (fechas[i] - fechas[i - 1]).days
        diferencias.append(diff)

    tiempo_medio = sum(diferencias) / len(diferencias) if diferencias else 0

    return {
        "apoderado_id": apoderado_id,
        "total_presencial": total_presencial,
        "total_vc": total_vc,
        "km_totales": km_totales,
        "tiempo_medio_dias": tiempo_medio,
        "citas": citas
    }


# ---------------------------------------------------------
# RANKING DE APODERADOS
# ---------------------------------------------------------
@router.get("/apoderados/ranking")
def ranking_apoderados(
    desde: date = Query(...),
    hasta: date = Query(...)
):
    """
    Ranking global de apoderados:
    - Total citas (P + VC)
    - Km totales
    Ordenado por actividad total
    """

    datos = db.fetch("""
        SELECT apoderado_id, tipo_firma, km
        FROM citas
        WHERE fecha BETWEEN :desde AND :hasta
    """, {"desde": desde, "hasta": hasta})

    ranking: Dict[int, Dict[str, Any]] = {}

    for c in datos:
        aid = c["apoderado_id"]

        if aid not in ranking:
            ranking[aid] = {
                "presencial": 0,
                "vc": 0,
                "km": 0,
            }

        if c["tipo_firma"] == "P":
            ranking[aid]["presencial"] += 1
            ranking[aid]["km"] += c["km"]
        else:
            ranking[aid]["vc"] += 1

    # Ordenar por nº total de citas (P + VC)
    ordenado = sorted(
        ranking.items(),
        key=lambda x: (x[1]["presencial"] + x[1]["vc"]),
        reverse=True
    )

    # Convertir a formato limpio
    resultado = [
        {
            "apoderado_id": aid,
            "presencial": datos["presencial"],
            "vc": datos["vc"],
            "km": datos["km"],
            "total_citas": datos["presencial"] + datos["vc"]
        }
        for aid, datos in ordenado
    ]

    return resultado
