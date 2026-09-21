from fastapi import APIRouter, Query
from datetime import date
from backend.app.database import db
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
    Informe detallado para un apoderado (empleado):
    - Nombre del apoderado
    - Nº citas presenciales
    - Nº citas por videoconferencia
    - Km recorridos en citas presenciales
    - Tiempo medio entre citas
    """

    citas = db.fetch("""
        SELECT 
            c.fecha,
            c.tipo_firma,
            c.km,
            e.nombre AS apoderado_nombre
        FROM citas c
        LEFT JOIN empleados e ON e.id = c.apoderado_id
        WHERE c.apoderado_id = :id
        AND c.fecha BETWEEN :desde AND :hasta
        ORDER BY c.fecha ASC
    """, {"id": apoderado_id, "desde": desde, "hasta": hasta})

    total_presencial = sum(1 for c in citas if c["tipo_firma"] == "P")
    total_vc = sum(1 for c in citas if c["tipo_firma"] == "VC")
    km_totales = sum(c["km"] for c in citas if c["tipo_firma"] == "P")

    fechas = [c["fecha"] for c in citas]
    fechas.sort()

    diferencias = [
        (fechas[i] - fechas[i - 1]).days
        for i in range(1, len(fechas))
    ]

    tiempo_medio = sum(diferencias) / len(diferencias) if diferencias else 0

    return {
        "apoderado_id": apoderado_id,
        "apoderado_nombre": citas[0]["apoderado_nombre"] if citas else None,
        "total_presencial": total_presencial,
        "total_vc": total_vc,
        "km_totales": km_totales,
        "tiempo_medio_dias": tiempo_medio,
        "citas": citas
    }


# ---------------------------------------------------------
# RANKING DE APODERADOS (empleados)
# ---------------------------------------------------------
@router.get("/apoderados/ranking")
def ranking_apoderados(
    desde: date = Query(...),
    hasta: date = Query(...)
):
    """
    Ranking global de apoderados (empleados):
    - Nombre del apoderado
    - Total citas (P + VC)
    - Km totales
    """

    datos = db.fetch("""
        SELECT 
            c.apoderado_id,
            c.tipo_firma,
            c.km,
            e.nombre AS apoderado_nombre
        FROM citas c
        LEFT JOIN empleados e ON e.id = c.apoderado_id
        WHERE c.fecha BETWEEN :desde AND :hasta
    """, {"desde": desde, "hasta": hasta})

    ranking = {}

    for c in datos:
        aid = c["apoderado_id"]

        if aid not in ranking:
            ranking[aid] = {
                "apoderado_id": aid,
                "nombre": c["apoderado_nombre"],
                "presencial": 0,
                "vc": 0,
                "km": 0,
            }

        if c["tipo_firma"] == "P":
            ranking[aid]["presencial"] += 1
            ranking[aid]["km"] += c["km"] or 0
        elif c["tipo_firma"] == "VC":
            ranking[aid]["vc"] += 1

    resultado = sorted(
        ranking.values(),
        key=lambda x: x["presencial"] + x["vc"],
        reverse=True
    )

    return resultado


# ---------------------------------------------------------
# TABLA MENSUAL/ANUAL (tipo Excel)
# ---------------------------------------------------------
@router.get("/apoderados/tabla")
def tabla_apoderados(
    mes: int = Query(..., ge=1, le=12),
    año: int = Query(..., ge=2000, le=2100)
):
    """
    Tabla mensual/anual para informes tipo Excel:
    - Nombre del apoderado
    - Nº VC
    - Nº Presencial
    - Km Presenciales
    """

    desde = date(año, mes, 1)
    hasta = date(año, mes, 31)

    datos = db.fetch("""
        SELECT 
            e.id AS apoderado_id,
            e.nombre AS nombre,
            c.tipo_firma,
            c.km
        FROM empleados e
        LEFT JOIN citas c 
            ON c.apoderado_id = e.id
            AND c.fecha BETWEEN :desde AND :hasta
        ORDER BY e.nombre ASC
    """, {"desde": desde, "hasta": hasta})

    tabla = {}

    for d in datos:
        aid = d["apoderado_id"]

        if aid not in tabla:
            tabla[aid] = {
                "apoderado_id": aid,
                "nombre": d["nombre"],
                "presencial": 0,
                "vc": 0,
                "km": 0,
            }

        if d["tipo_firma"] == "P":
            tabla[aid]["presencial"] += 1
            tabla[aid]["km"] += d["km"] or 0

        elif d["tipo_firma"] == "VC":
            tabla[aid]["vc"] += 1

    return list(tabla.values())
