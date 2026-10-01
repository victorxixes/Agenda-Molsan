from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from datetime import datetime
import json
import io

import openpyxl
from openpyxl.utils import get_column_letter
from fastapi.responses import StreamingResponse

from backend.app.database import get_db
from backend.app.expedientes.models import Expediente


router = APIRouter(
    prefix="/expedientes",
    tags=["Expedientes"],
)


# ============================================================
# COLUMNAS ORDENABLES
# ============================================================

COLUMNAS_ORDENABLES = {
    "id": Expediente.id,
    "id_expediente": Expediente.id_expediente,

    # ESTADOS
    "estado_expediente": Expediente.estado_expediente,
    "estado_expediente_ancert": Expediente.estado_expediente_ancert,

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
    "fcierre_defecto": Expediente.fcierre_defecto,
    "facturacion_fecha": Expediente.facturacion_fecha,
    "registral_fecha": Expediente.registral_fecha,

    # ACTIVIDAD
    "actividad_actual": Expediente.actividad_actual,
    "estado_actividad": Expediente.estado_actividad,

    # SOLICITANTE
    "nombre_solicitante": Expediente.nombre_solicitante,
    "nif_solicitante": Expediente.nif_solicitante,

    # TITULAR
    "nombre_titular": Expediente.nombre_titular,
    "nif_titular": Expediente.nif_titular,

    # APODERADO
    "apoderado": Expediente.apoderado,

    # NOTARIO
    "nombre_notario": Expediente.nombre_notario,
    "nif_notario": Expediente.nif_notario,
    "notario": Expediente.notario,

    # OFICINA
    "oficina": Expediente.oficina,
    "dan": Expediente.dan,
    "oficina_alta": Expediente.oficina_alta,

    # ECONÓMICOS
    "capital": Expediente.capital,
    "importe": Expediente.importe,
    "saldo_real": Expediente.saldo_real,
    "saldo_disponible": Expediente.saldo_disponible,

    # PROVISIÓN
    "id_provision": Expediente.id_provision,
    "tipo_provision": Expediente.tipo_provision,

    # OPERACIÓN
    "contrato": Expediente.contrato,
    "num_solicitud_sia": Expediente.num_solicitud_sia,
    "tipo_operacion": Expediente.tipo_operacion,
    "subtipo_operacion": Expediente.subtipo_operacion,
    "vinccanc": Expediente.vinccanc,
    "protocolo": Expediente.protocolo,

    # BANKIA / GTG
    "origen_bankia": Expediente.origen_bankia,
    "producto_gtg": Expediente.producto_gtg,
    "dt": Expediente.dt,

    # GESTORÍA
    "id_gestoria_tramite": Expediente.id_gestoria_tramite,
    "nombre_gestoria": Expediente.nombre_gestoria,
    "gestoria": Expediente.gestoria,

    # FINCA
    "finca": Expediente.finca,

    # DEFECTOS
    "tiene_defectos_abiertos": Expediente.tiene_defectos_abiertos,
    "tipo_error": Expediente.tipo_error,
    "descripcion_error": Expediente.descripcion_error,
    "falta_defecto": Expediente.falta_defecto,

    # CGN
    "id_expediente_cgn": Expediente.id_expediente_cgn,

    # ACTA
    "tipo_acta": Expediente.tipo_acta,

    # OTROS
    "lucy": Expediente.lucy,
    "indicador_tt": Expediente.indicador_tt,

    # OBSERVACIONES
    "observaciones": Expediente.observaciones,

    # FACTURACIÓN
    "facturacion_estado": Expediente.facturacion_estado,
    "facturacion_fecha": Expediente.facturacion_fecha,

    # REGISTRAL
    "registral_estado": Expediente.registral_estado,
    "registral_fecha": Expediente.registral_fecha,

    # RELACIÓN
    "cliente_id": Expediente.cliente_id,
}


# ============================================================
# COLUMNAS DEL EXCEL ABSIS
#
# IMPORTANTE:
# Este listado reproduce las columnas reales del Excel
# que has proporcionado.
# ============================================================

COLUMNAS_EXCEL = [
    ("IDEXPEDIENTE", "id_expediente"),
    ("ESTADOEXPEDIENTE", "estado_expediente"),
    ("FECHAALTA", "fecha_alta"),
    ("ORIGENBANKIA", "origen_bankia"),
    ("OBSERVACIONES", "observaciones"),
    ("DT", "dt"),
    ("PRODUCTOGTG", "producto_gtg"),
    ("FECHAFIRMA", "fecha_firma"),
    ("APODERADO", "apoderado"),
    ("FECHAINSCRIPCION", "fecha_inscripcion"),
    ("ACTIVIDADACTUAL", "actividad_actual"),
    ("ESTADOACTIVIDAD", "estado_actividad"),
    ("FECHAINICIOACTIVIDAD", "fecha_inicio_actividad"),
    ("FECHAFINACTIVIDAD", "fecha_fin_actividad"),
    ("IDPROVISION", "id_provision"),
    ("TIPOPROVISION", "tipo_provision"),
    ("CONTRATO", "contrato"),
    ("NUMSOLICITUDSIA", "num_solicitud_sia"),
    ("TIPOOPERACION", "tipo_operacion"),
    ("SUBTIPOOPERACION", "subtipo_operacion"),
    ("IDGESTORIATRAMITE", "id_gestoria_tramite"),
    ("NOMBREGESTORIA", "nombre_gestoria"),
    ("OFICINA", "oficina"),
    ("DAN", "dan"),
    ("OFICINAALTA", "oficina_alta"),
    ("CAPITAL", "capital"),
    ("IMPORTE", "importe"),
    ("SALDOREAL", "saldo_real"),
    ("SALDODISPONIBLE", "saldo_disponible"),
    ("VINCCANC", "vinccanc"),
    ("PROTOCOLO", "protocolo"),
    ("FINCA", "finca"),
    ("NOMBRESOLICITANTE", "nombre_solicitante"),
    ("NIFSOLICITANTE", "nif_solicitante"),
    ("NOMBRETITULAR", "nombre_titular"),
    ("NIFTITULAR", "nif_titular"),
    ("NOMBRENOTARIO", "nombre_notario"),
    ("NIFNOTARIO", "nif_notario"),
    ("TIENEDEFECTOSABIERTOS", "tiene_defectos_abiertos"),
    ("TIPOERROR", "tipo_error"),
    ("DESCRIPCIONERROR", "descripcion_error"),
    ("FALTADEFECTO", "falta_defecto"),
    ("FCIERREDEFECTO", "fcierre_defecto"),
    ("ESTADOEXPEDIENTEANCERT", "estado_expediente_ancert"),
    ("IDEXPEDIENTECGN", "id_expediente_cgn"),
    ("FECHASOLCGN", "fecha_sol_cgn"),
    ("FECHAENTREGADOCLIENTE", "fecha_entregado_cliente"),
    ("FECHAPREVISTAFIRMA", "fecha_prevista_firma"),
    ("FECHAVENCIMIENTO", "fecha_vencimiento"),
    ("NOTARIO", "notario"),
    ("TIPOACTA", "tipo_acta"),
    ("FECHAFIRMAPREVVAL", "fecha_firma_prev_val"),
    ("FECHAFIRMAPREVCLI", "fecha_firma_prev_cli"),
    ("LUCY", "lucy"),
    ("INDICADORTT", "indicador_tt"),
]


# ============================================================
# APLICAR FILTROS
# ============================================================

def aplicar_filtros(
    q,
    nif: Optional[str] = None,
    actividad: Optional[str] = None,
    fechaInicio: Optional[str] = None,
    fechaFin: Optional[str] = None,
    notario: Optional[str] = None,
    oficina: Optional[str] = None,
    importeMin: Optional[float] = None,
    importeMax: Optional[float] = None,
):
    """
    Aplica los filtros comunes utilizados por:

    - listado
    - exportación Excel
    """

    # ========================================================
    # NIF TITULAR
    # ========================================================

    if nif and nif.strip():

        patron = f"%{nif.strip()}%"

        q = q.filter(
            Expediente.nif_titular.ilike(patron)
        )

    # ========================================================
    # ACTIVIDAD
    # ========================================================

    if actividad and actividad.strip():

        patron = f"%{actividad.strip()}%"

        q = q.filter(
            Expediente.actividad_actual.ilike(patron)
        )

    # ========================================================
    # FECHA INICIO
    # ========================================================

    if fechaInicio:

        try:

            fecha_inicio = datetime.strptime(
                fechaInicio,
                "%Y-%m-%d",
            ).date()

            q = q.filter(
                Expediente.fecha_alta >= fecha_inicio
            )

        except ValueError:

            pass

    # ========================================================
    # FECHA FIN
    # ========================================================

    if fechaFin:

        try:

            fecha_fin = datetime.strptime(
                fechaFin,
                "%Y-%m-%d",
            ).date()

            q = q.filter(
                Expediente.fecha_alta <= fecha_fin
            )

        except ValueError:

            pass

    # ========================================================
    # NOTARIO
    # ========================================================

    if notario and notario.strip():

        patron = f"%{notario.strip()}%"

        q = q.filter(
            or_(
                Expediente.nombre_notario.ilike(patron),
                Expediente.nif_notario.ilike(patron),
                Expediente.notario.ilike(patron),
            )
        )

    # ========================================================
    # OFICINA
    # ========================================================

    if oficina and oficina.strip():

        patron = f"%{oficina.strip()}%"

        q = q.filter(
            Expediente.oficina.ilike(patron)
        )

    # ========================================================
    # IMPORTE MÍNIMO
    # ========================================================

    if importeMin is not None:

        q = q.filter(
            Expediente.importe >= importeMin
        )

    # ========================================================
    # IMPORTE MÁXIMO
    # ========================================================

    if importeMax is not None:

        q = q.filter(
            Expediente.importe <= importeMax
        )

    return q


# ============================================================
# LISTADO
# ============================================================

@router.get("/listado")
def listado_expedientes(
    pagina: int = 1,
    porPagina: int = 20,

    nif: Optional[str] = None,
    actividad: Optional[str] = None,
    fechaInicio: Optional[str] = None,
    fechaFin: Optional[str] = None,
    notario: Optional[str] = None,
    oficina: Optional[str] = None,
    importeMin: Optional[float] = None,
    importeMax: Optional[float] = None,

    ordenMultiple: Optional[str] = Query(None),

    db: Session = Depends(get_db),
):

    # ========================================================
    # PAGINACIÓN
    # ========================================================

    pagina = max(pagina, 1)
    porPagina = max(min(porPagina, 200), 1)

    # ========================================================
    # QUERY BASE
    # ========================================================

    q = db.query(Expediente)

    # ========================================================
    # FILTROS
    # ========================================================

    q = aplicar_filtros(
        q,
        nif=nif,
        actividad=actividad,
        fechaInicio=fechaInicio,
        fechaFin=fechaFin,
        notario=notario,
        oficina=oficina,
        importeMin=importeMin,
        importeMax=importeMax,
    )

    # ========================================================
    # ORDENACIÓN MÚLTIPLE
    # ========================================================

    orden_aplicado = False

    if ordenMultiple:

        try:

            ordenes = json.loads(ordenMultiple)

            if isinstance(ordenes, list):

                for orden in ordenes:

                    if not isinstance(orden, dict):
                        continue

                    columna = orden.get("columna")

                    direccion = str(
                        orden.get(
                            "direccion",
                            "asc",
                        )
                    ).lower()

                    campo = COLUMNAS_ORDENABLES.get(
                        columna
                    )

                    if campo is None:
                        continue

                    if direccion == "desc":

                        q = q.order_by(
                            campo.desc()
                        )

                    else:

                        q = q.order_by(
                            campo.asc()
                        )

                    orden_aplicado = True

        except (
            json.JSONDecodeError,
            TypeError,
            ValueError,
        ):

            pass

    # ========================================================
    # ORDEN POR DEFECTO
    # ========================================================

    if not orden_aplicado:

        q = q.order_by(
            Expediente.fecha_alta.desc(),
            Expediente.id_expediente.desc(),
        )

    # ========================================================
    # TOTAL
    # ========================================================

    total = q.count()

    total_paginas = max(
        1,
        (total + porPagina - 1) // porPagina,
    )

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
    db: Session = Depends(get_db),
):

    pendientes = (
        db.query(Expediente)
        .filter(
            Expediente.estado_expediente == "PENDIENTE"
        )
        .count()
    )

    en_curso = (
        db.query(Expediente)
        .filter(
            Expediente.estado_expediente == "EN CURSO"
        )
        .count()
    )

    finalizados = (
        db.query(Expediente)
        .filter(
            Expediente.estado_expediente == "FINALIZADO"
        )
        .count()
    )

    return {
        "pendientes": pendientes,
        "enCurso": en_curso,
        "finalizados": finalizados,
    }


# ============================================================
# EXPORTAR EXCEL
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

    # ========================================================
    # QUERY
    # ========================================================

    q = db.query(Expediente)

    q = aplicar_filtros(
        q,
        nif=nif,
        actividad=actividad,
        fechaInicio=fechaInicio,
        fechaFin=fechaFin,
        notario=notario,
        oficina=oficina,
        importeMin=importeMin,
        importeMax=importeMax,
    )

    expedientes = (
        q
        .order_by(
            Expediente.fecha_alta.desc(),
            Expediente.id_expediente.desc(),
        )
        .all()
    )

    # ========================================================
    # CREAR LIBRO
    # ========================================================

    wb = openpyxl.Workbook()

    ws = wb.active
    ws.title = "Expedientes"

    # ========================================================
    # CABECERAS
    # ========================================================

    for numero_columna, (cabecera, _) in enumerate(
        COLUMNAS_EXCEL,
        start=1,
    ):

        cell = ws.cell(
            row=1,
            column=numero_columna,
            value=cabecera,
        )

        cell.font = openpyxl.styles.Font(
            bold=True
        )

    # ========================================================
    # DATOS
    # ========================================================

    for numero_fila, expediente in enumerate(
        expedientes,
        start=2,
    ):

        for numero_columna, (_, atributo) in enumerate(
            COLUMNAS_EXCEL,
            start=1,
        ):

            valor = getattr(
                expediente,
                atributo,
                None,
            )

            cell = ws.cell(
                row=numero_fila,
                column=numero_columna,
                value=valor,
            )

            # Formato de fechas
            if isinstance(valor, datetime):

                cell.number_format = "dd/mm/yyyy"

            elif hasattr(valor, "year") and hasattr(
                valor,
                "month",
            ) and hasattr(
                valor,
                "day",
            ):

                cell.number_format = "dd/mm/yyyy"

    # ========================================================
    # INMOVILIZAR CABECERA
    # ========================================================

    ws.freeze_panes = "A2"

    # ========================================================
    # FILTROS DEL EXCEL
    # ========================================================

    if expedientes:

        ws.auto_filter.ref = (
            f"A1:{get_column_letter(len(COLUMNAS_EXCEL))}"
            f"{len(expedientes) + 1}"
        )

    else:

        ws.auto_filter.ref = (
            f"A1:{get_column_letter(len(COLUMNAS_EXCEL))}1"
        )

    # ========================================================
    # ANCHO DE COLUMNAS
    # ========================================================

    for numero_columna, (cabecera, _) in enumerate(
        COLUMNAS_EXCEL,
        start=1,
    ):

        max_length = len(cabecera)

        for numero_fila in range(
            2,
            min(len(expedientes) + 2, 500),
        ):

            valor = ws.cell(
                row=numero_fila,
                column=numero_columna,
            ).value

            if valor is not None:

                max_length = max(
                    max_length,
                    len(str(valor)),
                )

        ws.column_dimensions[
            get_column_letter(numero_columna)
        ].width = min(
            max(max_length + 2, 12),
            45,
        )

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


# ============================================================
# OBTENER EXPEDIENTE
#
# IMPORTANTE:
# Esta ruta dinámica debe estar AL FINAL.
# De lo contrario podría capturar:
#
# /resumen
# /exportar-excel
# /listado
#
# como si fueran IDs de expediente.
# ============================================================

@router.get("/{id_expediente}")
def obtener_expediente(
    id_expediente: str,
    db: Session = Depends(get_db),
):

    expediente = (
        db.query(Expediente)
        .filter(
            Expediente.id_expediente == id_expediente
        )
        .first()
    )

    if expediente is None:

        raise HTTPException(
            status_code=404,
            detail="Expediente no encontrado",
        )

    return expediente
