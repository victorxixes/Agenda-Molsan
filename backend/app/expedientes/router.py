from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date, datetime
import json
import io
import openpyxl
from fastapi.responses import StreamingResponse

from backend.app.database import get_db
from backend.app.expedientes.models import Expediente


router = APIRouter(
    prefix="/expedientes",
    tags=["Expedientes"]
)

# ============================================================
# COLUMNAS PERMITIDAS PARA ORDENACIÓN
# ============================================================

COLUMNAS_ORDENABLES = {
    "id": Expediente.id,
    "id_expediente": Expediente.id_expediente,

    # FECHAS
    "fecha_alta": Expediente.fecha_alta,
    "fecha_firma": Expediente.fecha_firma,
    "fecha_inscripcion": Expediente.fecha_inscripcion,
    "fecha_entregado_cliente": Expediente.fecha_entregado_cliente,
    "fecha_prevista_firma": Expediente.fecha_prevista_firma,
    "fecha_vencimiento": Expediente.fecha_vencimiento,
    "fecha_sol_cgn": Expediente.fecha_sol_cgn,
    "fecha_firma_prev_val": Expediente.fecha_firma_prev_val,
    "fecha_firma_prev_cli": Expediente.fecha_firma_prev_cli,
    "fecha_inicio_actividad": Expediente.fecha_inicio_actividad,
    "fecha_fin_actividad": Expediente.fecha_fin_actividad,
    "facturacion_fecha": Expediente.facturacion_fecha,
    "registral_fecha": Expediente.registral_fecha,

    # ESTADOS
    "estado_expediente": Expediente.estado_expediente,
    "estado_expediente_ancert": Expediente.estado_expediente_ancert,
    "estado_actividad": Expediente.estado_actividad,
    "facturacion_estado": Expediente.facturacion_estado,
    "registral_estado": Expediente.registral_estado,

    # ACTIVIDAD
    "actividad_actual": Expediente.actividad_actual,

    # TITULAR
    "nombre_titular": Expediente.nombre_titular,
    "nif_titular": Expediente.nif_titular,

    # NOTARIO
    "nombre_notario": Expediente.nombre_notario,
    "nif_notario": Expediente.nif_notario,
    "notario": Expediente.notario,

    # OFICINA
    "oficina": Expediente.oficina,
    "oficina_alta": Expediente.oficina_alta,
    "dan": Expediente.dan,

    # ECONÓMICOS
    "importe": Expediente.importe,
    "capital": Expediente.capital,
    "saldo_real": Expediente.saldo_real,
    "saldo_disponible": Expediente.saldo_disponible,

    # OPERACIÓN
    "tipo_operacion": Expediente.tipo_operacion,
    "subtipo_operacion": Expediente.subtipo_operacion,
    "contrato": Expediente.contrato,
    "num_solicitud_sia": Expediente.num_solicitud_sia,
    "vinccanc": Expediente.vinccanc,
    "protocolo": Expediente.protocolo,

    # GTG / BANKIA
    "producto_gtg": Expediente.producto_gtg,
    "origen_bankia": Expediente.origen_bankia,
    "dt": Expediente.dt,

    # GESTORÍA
    "gestoria": Expediente.gestoria,

    # CGN
    "id_expediente_cgn": Expediente.id_expediente_cgn,

    # OTROS
    "lucy": Expediente.lucy,
    "indicador_tt": Expediente.indicador_tt,

    # OBSERVACIONES
    "observaciones": Expediente.observaciones,

    # RELACIONES
    "cliente_id": Expediente.cliente_id,
}


# ============================================================
# LISTADO
# FILTROS + ORDENACIÓN MÚLTIPLE + PAGINACIÓN
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
    # ========================================================
    # VALIDAR PAGINACIÓN
    # ========================================================

    if pagina < 1:
        pagina = 1

    if porPagina < 1:
        porPagina = 20

    if porPagina > 200:
        porPagina = 200

    # ========================================================
    # QUERY BASE
    # ========================================================

    q = db.query(Expediente)

    # ========================================================
    # FILTRO NIF TITULAR
    # ========================================================

    if nif:
        q = q.filter(
            Expediente.nif_titular.ilike(f"%{nif}%")
        )

    # ========================================================
    # FILTRO ACTIVIDAD
    # ========================================================

    if actividad:
        q = q.filter(
            Expediente.actividad_actual.ilike(
                f"%{actividad}%"
            )
        )

    # ========================================================
    # FILTRO FECHA INICIO
    # ========================================================

    if fechaInicio:
        try:
            fecha_inicio = datetime.strptime(
                fechaInicio,
                "%Y-%m-%d"
            ).date()

            q = q.filter(
                Expediente.fecha_alta >= fecha_inicio
            )

        except ValueError:
            pass

    # ========================================================
    # FILTRO FECHA FIN
    # ========================================================

    if fechaFin:
        try:
            fecha_fin = datetime.strptime(
                fechaFin,
                "%Y-%m-%d"
            ).date()

            q = q.filter(
                Expediente.fecha_alta <= fecha_fin
            )

        except ValueError:
            pass

    # ========================================================
    # FILTRO NOTARIO
    # ========================================================

    if notario:
        q = q.filter(
            Expediente.nif_notario.ilike(
                f"%{notario}%"
            )
        )

    # ========================================================
    # FILTRO OFICINA
    # ========================================================

    if oficina:
        q = q.filter(
            Expediente.oficina.ilike(
                f"%{oficina}%"
            )
        )

    # ========================================================
    # FILTRO IMPORTE MÍNIMO
    # ========================================================

    if importeMin is not None:
        q = q.filter(
            Expediente.importe >= importeMin
        )

    # ========================================================
    # FILTRO IMPORTE MÁXIMO
    # ========================================================

    if importeMax is not None:
        q = q.filter(
            Expediente.importe <= importeMax
        )

    # ========================================================
    # ORDENACIÓN
    # ========================================================

    if ordenMultiple:

        try:
            ordenes: List[dict] = json.loads(
                ordenMultiple
            )

        except Exception:
            ordenes = []

        for orden in ordenes:

            col_name = orden.get("columna")
            dir_name = orden.get(
                "direccion",
                "asc"
            )

            col = COLUMNAS_ORDENABLES.get(
                col_name
            )

            if col is None:
                continue

            if dir_name == "desc":
                q = q.order_by(
                    col.desc()
                )
            else:
                q = q.order_by(
                    col.asc()
                )

    else:

        q = q.order_by(
            Expediente.fecha_alta.desc()
        )

    # ========================================================
    # TOTAL
    # ========================================================

    total = q.count()

    total_paginas = (
        (total + porPagina - 1)
        // porPagina
    )

    if total_paginas == 0:
        total_paginas = 1

    # ========================================================
    # PAGINACIÓN
    # ========================================================

    items = (
        q
        .offset(
            (pagina - 1) * porPagina
        )
        .limit(porPagina)
        .all()
    )

    # ========================================================
    # RESPUESTA
    # ========================================================

    return {
        "items": items,
        "total": total,
        "pagina": pagina,
        "porPagina": porPagina,
        "total_paginas": total_paginas,
    }


# ============================================================
# RESUMEN
# ============================================================

@router.get("/resumen")
def resumen_expedientes(
    db: Session = Depends(get_db)
):

    pendientes = (
        db.query(Expediente)
        .filter(
            Expediente.estado_expediente
            == "PENDIENTE"
        )
        .count()
    )

    en_curso = (
        db.query(Expediente)
        .filter(
            Expediente.estado_expediente
            == "EN CURSO"
        )
        .count()
    )

    finalizados = (
        db.query(Expediente)
        .filter(
            Expediente.estado_expediente
            == "FINALIZADO"
        )
        .count()
    )

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

    # ========================================================
    # FILTROS
    # ========================================================

    if nif:
        q = q.filter(
            Expediente.nif_titular.ilike(
                f"%{nif}%"
            )
        )

    if actividad:
        q = q.filter(
            Expediente.actividad_actual.ilike(
                f"%{actividad}%"
            )
        )

    if fechaInicio:
        try:
            fecha_inicio = datetime.strptime(
                fechaInicio,
                "%Y-%m-%d"
            ).date()

            q = q.filter(
                Expediente.fecha_alta >= fecha_inicio
            )

        except ValueError:
            pass

    if fechaFin:
        try:
            fecha_fin = datetime.strptime(
                fechaFin,
                "%Y-%m-%d"
            ).date()

            q = q.filter(
                Expediente.fecha_alta <= fecha_fin
            )

        except ValueError:
            pass

    if notario:
        q = q.filter(
            Expediente.nif_notario.ilike(
                f"%{notario}%"
            )
        )

    if oficina:
        q = q.filter(
            Expediente.oficina.ilike(
                f"%{oficina}%"
            )
        )

    if importeMin is not None:
        q = q.filter(
            Expediente.importe >= importeMin
        )

    if importeMax is not None:
        q = q.filter(
            Expediente.importe <= importeMax
        )

    # ========================================================
    # ORDEN
    # ========================================================

    expedientes = (
        q
        .order_by(
            Expediente.fecha_alta.desc()
        )
        .all()
    )

    # ========================================================
    # CREAR EXCEL
    # ========================================================

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

    # ========================================================
    # FILAS
    # ========================================================

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

    # ========================================================
    # GENERAR ARCHIVO
    # ========================================================

    buffer = io.BytesIO()

    wb.save(buffer)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        ),
        headers={
            "Content-Disposition":
                'attachment; filename="expedientes.xlsx"'
        },
    )
