from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
import json
import io
import openpyxl
from fastapi.responses import StreamingResponse

from backend.app.database import get_db
from backend.app.expedientes.models import Expediente

router = APIRouter(prefix="/expedientes", tags=["Expedientes"])


# ============================================================
# LISTADO CON FILTROS + ORDENACIÓN MÚLTIPLE + PAGINACIÓN
# ============================================================
@router.get("/listado")
def listado_expedientes(
    pagina: int = 1,
    porPagina: int = 20,

    # FILTROS
    nif: Optional[str] = None,
    actividad: Optional[str] = None,
    fechaInicio: Optional[str] = None,
    fechaFin: Optional[str] = None,
    notario: Optional[str] = None,
    oficina: Optional[str] = None,
    importeMin: Optional[float] = None,
    importeMax: Optional[float] = None,

    # ORDENACIÓN MÚLTIPLE
    ordenMultiple: Optional[str] = Query(None),

    db: Session = Depends(get_db),
):
    q = db.query(Expediente)

    # -------------------------
    # FILTROS
    # -------------------------
    if nif:
        q = q.filter(Expediente.nif_titular.ilike(f"%{nif}%"))

    if actividad:
        q = q.filter(Expediente.actividad_actual.ilike(f"%{actividad}%"))

    if fechaInicio:
        q = q.filter(Expediente.fecha_alta >= fechaInicio)

    if fechaFin:
        q = q.filter(Expediente.fecha_alta <= fechaFin)

    if notario:
        q = q.filter(Expediente.nif_notario.ilike(f"%{notario}%"))

    if oficina:
        q = q.filter(Expediente.oficina.ilike(f"%{oficina}%"))

    if importeMin is not None:
        q = q.filter(Expediente.importe >= importeMin)

    if importeMax is not None:
        q = q.filter(Expediente.importe <= importeMax)

    # -------------------------
    # ORDENACIÓN MÚLTIPLE
    # -------------------------
    if ordenMultiple:
        try:
            ordenes: List[dict] = json.loads(ordenMultiple)
        except Exception:
            ordenes = []

        for orden in ordenes:
            col_name = orden.get("columna")
            dir_name = orden.get("direccion", "asc")

            col = getattr(Expediente, col_name, None)
            if col is not None:
                if dir_name == "asc":
                    q = q.order_by(col.asc())
                else:
                    q = q.order_by(col.desc())
    else:
        # Orden por defecto
        q = q.order_by(Expediente.fecha_alta.desc())

    # -------------------------
    # PAGINACIÓN
    # -------------------------
    total = q.count()
    total_paginas = (total + porPagina - 1) // porPagina

    items = (
        q.offset((pagina - 1) * porPagina)
         .limit(porPagina)
         .all()
    )

    return {
        "items": items,
        "total_paginas": total_paginas,
    }


# ============================================================
# RESUMEN PARA GRÁFICOS
# ============================================================
@router.get("/resumen")
def resumen_expedientes(db: Session = Depends(get_db)):
    pendientes = db.query(Expediente).filter(Expediente.estado_expediente == "PENDIENTE").count()
    en_curso = db.query(Expediente).filter(Expediente.estado_expediente == "EN CURSO").count()
    finalizados = db.query(Expediente).filter(Expediente.estado_expediente == "FINALIZADO").count()

    return {
        "pendientes": pendientes,
        "enCurso": en_curso,
        "finalizados": finalizados,
    }


# ============================================================
# EXPORTAR A EXCEL
# ============================================================
@router.get("/exportar-excel")
def exportar_excel_expedientes(
    nif: Optional[str] = None,
    actividad: Optional[str] = None,
    fechaInicio: Optional[str] = None,
    fechaFin: Optional[str] = None,
    notario: Optional[str] = None,
    oficina: Optional[str] = None,
    importeMin: Optional[float] = None,
    importeMax: Optional[float] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Expediente)

    # mismos filtros que listado
    if nif:
        q = q.filter(Expediente.nif_titular.ilike(f"%{nif}%"))

    if actividad:
        q = q.filter(Expediente.actividad_actual.ilike(f"%{actividad}%"))

    if fechaInicio:
        q = q.filter(Expediente.fecha_alta >= fechaInicio)

    if fechaFin:
        q = q.filter(Expediente.fecha_alta <= fechaFin)

    if notario:
        q = q.filter(Expediente.nif_notario.ilike(f"%{notario}%"))

    if oficina:
        q = q.filter(Expediente.oficina.ilike(f"%{oficina}%"))

    if importeMin is not None:
        q = q.filter(Expediente.importe >= importeMin)

    if importeMax is not None:
        q = q.filter(Expediente.importe <= importeMax)

    expedientes = q.order_by(Expediente.fecha_alta.desc()).all()

    # -------------------------
    # GENERAR EXCEL
    # -------------------------
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Expedientes"

    headers = [
        "Nº Expediente",
        "Fecha Alta",
        "Actividad actual",
        "Estado expediente",
        "Estado actividad",
        "Importe",
        "Capital",
        "Saldo real",
        "Saldo disponible",
        "Nombre titular",
        "NIF titular",
        "Nombre notario",
        "NIF notario",
        "Oficina",
        "Tipo operación",
        "Subtipo operación",
        "Producto GTG",
        "Gestoría",
    ]
    ws.append(headers)

    for exp in expedientes:
        ws.append([
            exp.id_expediente,
            exp.fecha_alta,
            exp.actividad_actual,
            exp.estado_expediente,
            exp.estado_actividad,
            exp.importe,
            exp.capital,
            exp.saldo_real,
            exp.saldo_disponible,
            exp.nombre_titular,
            exp.nif_titular,
            exp.nombre_notario,
            exp.nif_notario,
            exp.oficina,
            exp.tipo_operacion,
            exp.subtipo_operacion,
            exp.producto_gtg,
            exp.gestoria,
        ])

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="expedientes.xlsx"'},
    )
