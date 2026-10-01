from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
import json
import io
import openpyxl

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
    "oficina_alta": Expediente.oficina_alta,
    "dan": Expediente.dan,

    # ECONÓMICOS
    "capital": Expediente.capital,
    "importe": Expediente.importe,
    "saldo_real": Expediente.saldo_real,
    "saldo_disponible": Expediente.saldo_disponible,

    # OPERACIÓN
    "contrato": Expediente.contrato,
    "num_solicitud_sia": Expediente.num_solicitud_sia,
    "tipo_operacion": Expediente.tipo_operacion,
    "subtipo_operacion": Expediente.subtipo_operacion,
    "vinccanc": Expediente.vinccanc,
    "protocolo": Expediente.protocolo,

    # PROVISIÓN
    "id_provision": Expediente.id_provision,
    "tipo_provision": Expediente.tipo_provision,

    # GESTORÍA
    "id_gestoria_tramite": Expediente.id_gestoria_tramite,
    "gestoria": Expediente.gestoria,

    # GTG / BANKIA
    "origen_bankia": Expediente.origen_bankia,
    "producto_gtg": Expediente.producto_gtg,
    "dt": Expediente.dt,

    # REGISTRAL
    "finca": Expediente.finca,

    # CGN
    "id_expediente_cgn": Expediente.id_expediente_cgn,

    # DEFECTOS
    "tiene_defectos_abiertos": Expediente.tiene_defectos_abiertos,
    "tipo_error": Expediente.tipo_error,
    "descripcion_error": Expediente.descripcion_error,
    "falta_defecto": Expediente.falta_defecto,

    # ACTA
    "tipo_acta": Expediente.tipo_acta,

    # OTROS
    "lucy": Expediente.lucy,
    "indicador_tt": Expediente.indicador_tt,

    # OBSERVACIONES
    "observaciones": Expediente.observaciones,

    # INTERNOS
    "facturacion_estado": Expediente.facturacion_estado,
    "registral_estado": Expediente.registral_estado,

    # RELACIÓN
    "cliente_id": Expediente.cliente_id,
}


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
    # --------------------------------------------------------
    # NIF
    # --------------------------------------------------------

    if nif:
        patron = f"%{nif.strip()}%"

        q = q.filter(
            Expediente.nif_titular.ilike(patron)
        )

    # --------------------------------------------------------
    # ACTIVIDAD
    # --------------------------------------------------------

    if actividad:
        patron = f"%{actividad.strip()}%"

        q = q.filter(
            Expediente.actividad_actual.ilike(patron)
        )

    # --------------------------------------------------------
    # FECHA INICIO
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # FECHA FIN
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # NOTARIO
    # --------------------------------------------------------

    if notario:

        patron = f"%{notario.strip()}%"

        q = q.filter(
            (
                Expediente.nombre_notario.ilike(patron)
            )
            |
            (
                Expediente.nif_notario.ilike(patron)
            )
            |
            (
                Expediente.notario.ilike(patron)
            )
        )

    # --------------------------------------------------------
    # OFICINA
    # --------------------------------------------------------

    if oficina:

        patron = f"%{oficina.strip()}%"

        q = q.filter(
            Expediente.oficina.ilike(patron)
        )

    # --------------------------------------------------------
    # IMPORTE MÍNIMO
    # --------------------------------------------------------

    if importeMin is not None:

        q = q.filter(
            Expediente.importe >= importeMin
        )

    # --------------------------------------------------------
    # IMPORTE MÁXIMO
    # --------------------------------------------------------

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
    porPagina = max(porPagina, 1)
    porPagina = min(porPagina, 200)

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

    # ========================================================
    # ORDENACIÓN MÚLTIPLE
    # ========================================================

    orden_aplicado = False

    if ordenMultiple:

        try:

            ordenes: List[dict] = json.loads(
                ordenMultiple
            )

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
# OBTENER EXPEDIENTE
# ============================================================

@router.get("/{id_expediente}")
def obtener_expediente(
    id_expediente: str,
    db: Session = Depends(get_db),
):

    expediente = (
        db.query(Expediente)
        .filter(
            Expediente.id_expediente
            == id_expediente
        )
        .first()
    )

    if expediente is None:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Expediente no encontrado",
        )

    return expediente


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
    # MAPA EXCEL -> MODELO
    # ========================================================

    columnas = [
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
        ("NOMBREGESTORIA", "gestoria"),
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

    # ========================================================
    # CREAR EXCEL
    # ========================================================

    wb = openpyxl.Workbook()

    ws = wb.active
    ws.title = "Expedientes"

    # Cabeceras
    ws.append([
        cabecera
        for cabecera, _ in columnas
    ])

    # ========================================================
    # DATOS
    # ========================================================

    for expediente in expedientes:

        fila = []

        for _, atributo in columnas:

            valor = getattr(
                expediente,
                atributo,
                None,
            )

            fila.append(valor)

        ws.append(fila)

    # ========================================================
    # FORMATO
    # ========================================================

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = ws.dimensions

    # Ancho razonable de columnas
    for column_cells in ws.columns:

        max_length = 0

        for cell in column_cells:

            if cell.value is not None:

                max_length = max(
                    max_length,
                    len(str(cell.value)),
                )

        ws.column_dimensions[
            column_cells[0].column_letter
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
