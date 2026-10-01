import io
from datetime import date, datetime
from typing import Any

import pandas as pd
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente


# ============================================================
# CONFIGURACIÓN
# ============================================================

BATCH_SIZE = 500


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def limpiar_valor(valor: Any):
    """
    Convierte valores pandas/numpy a valores Python normales.

    Evita guardar:
    - NaN
    - NaT
    - valores vacíos
    """

    if valor is None:
        return None

    try:
        if pd.isna(valor):
            return None
    except (TypeError, ValueError):
        pass

    if isinstance(valor, pd.Timestamp):
        return valor.to_pydatetime()

    return valor


def limpiar_texto(valor: Any):
    """
    Convierte un valor a texto limpio.
    """

    valor = limpiar_valor(valor)

    if valor is None:
        return None

    texto = str(valor).strip()

    if not texto:
        return None

    return texto


def obtener_valor(row, *columnas):
    """
    Devuelve el primer valor válido encontrado.
    """

    for columna in columnas:

        if columna not in row.index:
            continue

        valor = limpiar_valor(row[columna])

        if valor is None:
            continue

        if isinstance(valor, str):

            valor = valor.strip()

            if not valor:
                continue

        return valor

    return None


def convertir_fecha(valor):
    """
    Convierte cualquier fecha del Excel a date.

    Acepta:
    - 08/11/2025
    - 08/11/2025 00:00:00
    - 2025-11-08
    - pandas.Timestamp
    """

    valor = limpiar_valor(valor)

    if valor is None:
        return None

    if isinstance(valor, datetime):
        return valor.date()

    if isinstance(valor, date):
        return valor

    try:

        fecha = pd.to_datetime(
            valor,
            dayfirst=True,
            errors="coerce",
        )

        if pd.isna(fecha):
            return None

        return fecha.date()

    except Exception:
        return None


def convertir_numero(valor):
    """
    Convierte números procedentes del Excel.

    Evita problemas con:
    - NaN
    - strings vacíos
    - comas decimales
    """

    valor = limpiar_valor(valor)

    if valor is None:
        return None

    if isinstance(valor, str):

        valor = valor.strip()

        if not valor:
            return None

        valor = valor.replace(".", "").replace(",", ".")

    try:
        return float(valor)

    except (TypeError, ValueError):
        return None


# ============================================================
# IMPORTADOR PRINCIPAL
# ============================================================

def importar_excel_expedientes(
    db: Session,
    contenido_excel: bytes,
    fecha_objetivo: date = None,
):
    """
    Importa expedientes desde el Excel matriz ABSIS.

    IMPORTANTE:

    El Excel es la fuente de datos del módulo Expedientes.

    Se importan todos los campos disponibles del Excel que
    tienen correspondencia en el modelo Expediente.
    """

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - INICIO", flush=True)
    print("============================================", flush=True)

    if fecha_objetivo is None:
        fecha_objetivo = date.today()

    print(
        f"FECHA OBJETIVO: {fecha_objetivo}",
        flush=True,
    )

    print(
        f"TAMAÑO DEL FICHERO: {len(contenido_excel)} bytes",
        flush=True,
    )

    # ========================================================
    # LEER EXCEL
    # ========================================================

    print(
        "IMPORTADOR: leyendo Excel con pandas...",
        flush=True,
    )

    try:

        df = pd.read_excel(
            io.BytesIO(contenido_excel),
            sheet_name=0,
            header=0,
            engine="openpyxl",
        )

    except Exception as e:

        print(
            f"ERROR LEYENDO EXCEL: {e}",
            flush=True,
        )

        raise ValueError(
            f"No se pudo leer el Excel: {e}"
        )

    print(
        "IMPORTADOR: Excel leído correctamente.",
        flush=True,
    )

    print(
        f"TOTAL FILAS EXCEL: {len(df)}",
        flush=True,
    )

    print(
        f"TOTAL COLUMNAS EXCEL: {len(df.columns)}",
        flush=True,
    )

    # ========================================================
    # NORMALIZAR COLUMNAS
    # ========================================================

    df.columns = [
        str(col).strip().upper()
        for col in df.columns
    ]

    print(
        f"COLUMNAS NORMALIZADAS: {list(df.columns)}",
        flush=True,
    )

    # ========================================================
    # COLUMNAS OBLIGATORIAS
    # ========================================================

    if "FECHAALTA" not in df.columns:
        raise ValueError(
            "El Excel no contiene la columna FECHAALTA."
        )

    if "IDEXPEDIENTE" not in df.columns:
        raise ValueError(
            "El Excel no contiene la columna IDEXPEDIENTE."
        )

    # ========================================================
    # FECHA ALTA
    # ========================================================

    df["FECHAALTA"] = pd.to_datetime(
        df["FECHAALTA"],
        dayfirst=True,
        errors="coerce",
    )

    fechas_validas = df["FECHAALTA"].notna().sum()

    print(
        f"FECHAS VÁLIDAS EN EXCEL: {fechas_validas}",
        flush=True,
    )

    # ========================================================
    # FILTRAR FECHA
    # ========================================================

    fecha_timestamp = pd.Timestamp(fecha_objetivo)

    df_filtrado = df[
        df["FECHAALTA"].dt.normalize()
        == fecha_timestamp
    ].copy()

    total_filtrados = len(df_filtrado)

    print(
        f"FILAS ENCONTRADAS PARA "
        f"{fecha_objetivo}: {total_filtrados}",
        flush=True,
    )

    if total_filtrados == 0:

        return {
            "creados": 0,
            "actualizados": 0,
            "errores": 0,
            "fecha_importada": fecha_objetivo.isoformat(),
            "total_filtrados": 0,
            "total_procesados": 0,
        }

    # ========================================================
    # LIMPIAR ID
    # ========================================================

    df_filtrado["IDEXPEDIENTE"] = (
        df_filtrado["IDEXPEDIENTE"]
        .apply(limpiar_texto)
    )

    df_filtrado = df_filtrado[
        df_filtrado["IDEXPEDIENTE"].notna()
    ].copy()

    df_filtrado = df_filtrado[
        df_filtrado["IDEXPEDIENTE"] != ""
    ].copy()

    total_filtrados = len(df_filtrado)

    if total_filtrados == 0:

        return {
            "creados": 0,
            "actualizados": 0,
            "errores": 0,
            "fecha_importada": fecha_objetivo.isoformat(),
            "total_filtrados": 0,
            "total_procesados": 0,
        }

    # ========================================================
    # IDS ÚNICOS
    # ========================================================

    ids_excel = (
        df_filtrado["IDEXPEDIENTE"]
        .drop_duplicates()
        .tolist()
    )

    # ========================================================
    # BUSCAR EXISTENTES
    # ========================================================

    existentes_por_id = {}

    for inicio in range(
        0,
        len(ids_excel),
        BATCH_SIZE,
    ):

        bloque_ids = ids_excel[
            inicio:inicio + BATCH_SIZE
        ]

        existentes = (
            db.query(Expediente)
            .filter(
                Expediente.id_expediente.in_(
                    bloque_ids
                )
            )
            .all()
        )

        for exp in existentes:

            existentes_por_id[
                str(exp.id_expediente).strip()
            ] = exp

    print(
        f"EXPEDIENTES YA EXISTENTES: "
        f"{len(existentes_por_id)}",
        flush=True,
    )

    # ========================================================
    # CONTADORES
    # ========================================================

    creados = 0
    actualizados = 0
    errores = 0
    procesados = 0

    # ========================================================
    # PROCESAR
    # ========================================================

    for _, row in df_filtrado.iterrows():

        idexp = limpiar_texto(
            row.get("IDEXPEDIENTE")
        )

        if not idexp:
            continue

        try:

            exp = existentes_por_id.get(idexp)

            # ------------------------------------------------
            # CREAR
            # ------------------------------------------------

            if exp is None:

                exp = Expediente(
                    id_expediente=idexp
                )

                db.add(exp)

                existentes_por_id[idexp] = exp

                creados += 1

            else:

                actualizados += 1

            # ==================================================
            # ESTADOS
            # ==================================================

            exp.estado_expediente = obtener_valor(
                row,
                "ESTADOEXPEDIENTE",
            )

            exp.estado_expediente_ancert = obtener_valor(
                row,
                "ESTADOEXPEDIENTEANCERT",
            )

            # ==================================================
            # FECHAS
            # ==================================================

            exp.fecha_alta = convertir_fecha(
                row.get("FECHAALTA")
            )

            exp.fecha_firma = convertir_fecha(
                row.get("FECHAFIRMA")
            )

            exp.fecha_inscripcion = convertir_fecha(
                row.get("FECHAINSCRIPCION")
            )

            exp.fecha_entregado_cliente = convertir_fecha(
                row.get("FECHAENTREGADOCLIENTE")
            )

            exp.fecha_prevista_firma = convertir_fecha(
                row.get("FECHAPREVISTAFIRMA")
            )

            exp.fecha_vencimiento = convertir_fecha(
                row.get("FECHAVENCIMIENTO")
            )

            exp.fecha_sol_cgn = convertir_fecha(
                row.get("FECHASOLCGN")
            )

            exp.fecha_firma_prev_val = convertir_fecha(
                row.get("FECHAFIRMAPREVVAL")
            )

            exp.fecha_firma_prev_cli = convertir_fecha(
                row.get("FECHAFIRMAPREVCLI")
            )

            exp.fecha_inicio_actividad = convertir_fecha(
                row.get("FECHAINICIOACTIVIDAD")
            )

            exp.fecha_fin_actividad = convertir_fecha(
                row.get("FECHAFINACTIVIDAD")
            )

            exp.fecha_cierre_defecto = convertir_fecha(
                row.get("FCIERREDEFECTO")
            )

            # ==================================================
            # ACTIVIDAD
            # ==================================================

            exp.actividad_actual = obtener_valor(
                row,
                "ACTIVIDADACTUAL",
            )

            exp.estado_actividad = obtener_valor(
                row,
                "ESTADOACTIVIDAD",
            )

            # ==================================================
            # SOLICITANTE
            # ==================================================

            exp.nombresolicitante = obtener_valor(
                row,
                "NOMBRESOLICITANTE",
            )

            exp.nifsolicitante = obtener_valor(
                row,
                "NIFSOLICITANTE",
            )

            # ==================================================
            # TITULAR
            # ==================================================

            exp.nombre_titular = obtener_valor(
                row,
                "NOMBRETITULAR",
            )

            exp.nif_titular = obtener_valor(
                row,
                "NIFTITULAR",
            )

            # ==================================================
            # APODERADO
            # ==================================================

            exp.apoderado = obtener_valor(
                row,
                "APODERADO",
            )

            # ==================================================
            # NOTARIO
            # ==================================================

            exp.nombre_notario = obtener_valor(
                row,
                "NOMBRENOTARIO",
            )

            exp.nif_notario = obtener_valor(
                row,
                "NIFNOTARIO",
            )

            exp.notario = obtener_valor(
                row,
                "NOTARIO",
                "NOMBRENOTARIO",
            )

            # ==================================================
            # OFICINA
            # ==================================================

            exp.oficina = obtener_valor(
                row,
                "OFICINA",
            )

            exp.oficina_alta = obtener_valor(
                row,
                "OFICINAALTA",
            )

            exp.dan = obtener_valor(
                row,
                "DAN",
            )

            # ==================================================
            # ECONÓMICOS
            # ==================================================

            exp.capital = convertir_numero(
                row.get("CAPITAL")
            )

            exp.importe = convertir_numero(
                row.get("IMPORTE")
            )

            exp.saldo_real = convertir_numero(
                row.get("SALDOREAL")
            )

            exp.saldo_disponible = convertir_numero(
                row.get("SALDODISPONIBLE")
            )

            # ==================================================
            # OPERACIÓN
            # ==================================================

            exp.contrato = obtener_valor(
                row,
                "CONTRATO",
            )

            exp.num_solicitud_sia = obtener_valor(
                row,
                "NUMSOLICITUDSIA",
            )

            exp.tipo_operacion = obtener_valor(
                row,
                "TIPOOPERACION",
            )

            exp.subtipo_operacion = obtener_valor(
                row,
                "SUBTIPOOPERACION",
            )

            exp.vinccanc = obtener_valor(
                row,
                "VINCCANC",
            )

            exp.protocolo = obtener_valor(
                row,
                "PROTOCOLO",
            )

            # ==================================================
            # PROVISIÓN
            # ==================================================

            exp.id_provision = obtener_valor(
                row,
                "IDPROVISION",
            )

            exp.tipo_provision = obtener_valor(
                row,
                "TIPOPROVISION",
            )

            # ==================================================
            # GTG / BANKIA
            # ==================================================

            exp.origen_bankia = obtener_valor(
                row,
                "ORIGENBANKIA",
            )

            exp.producto_gtg = obtener_valor(
                row,
                "PRODUCTOGTG",
            )

            exp.dt = obtener_valor(
                row,
                "DT",
            )

            # ==================================================
            # GESTORÍA
            # ==================================================

            exp.id_gestoria_tramite = obtener_valor(
                row,
                "IDGESTORIATRAMITE",
            )

            exp.nombre_gestoria = obtener_valor(
                row,
                "NOMBREGESTORIA",
            )

            exp.gestoria = obtener_valor(
                row,
                "NOMBREGESTORIA",
                "GESTORIA",
            )

            # ==================================================
            # FINCA
            # ==================================================

            exp.finca = obtener_valor(
                row,
                "FINCA",
            )

            # ==================================================
            # DEFECTOS
            # ==================================================

            exp.tiene_defectos_abiertos = obtener_valor(
                row,
                "TIENEDEFECTOSABIERTOS",
            )

            exp.tipo_error = obtener_valor(
                row,
                "TIPOERROR",
            )

            exp.descripcion_error = obtener_valor(
                row,
                "DESCRIPCIONERROR",
            )

            exp.falta_defecto = obtener_valor(
                row,
                "FALTADEFECTO",
            )

            # ==================================================
            # CGN
            # ==================================================

            exp.id_expediente_cgn = obtener_valor(
                row,
                "IDEXPEDIENTECGN",
            )

            # ==================================================
            # ACTA
            # ==================================================

            exp.tipo_acta = obtener_valor(
                row,
                "TIPOACTA",
            )

            # ==================================================
            # OTROS
            # ==================================================

            exp.lucy = obtener_valor(
                row,
                "LUCY",
            )

            exp.indicador_tt = obtener_valor(
                row,
                "INDICADORTT",
            )

            # ==================================================
            # OBSERVACIONES
            # ==================================================

            exp.observaciones = obtener_valor(
                row,
                "OBSERVACIONES",
            )

            # ==================================================
            # CONTADOR
            # ==================================================

            procesados += 1

            if procesados % 25 == 0:

                print(
                    f"PROGRESO: {procesados}/"
                    f"{total_filtrados} "
                    f"| creados={creados} "
                    f"| actualizados={actualizados} "
                    f"| errores={errores}",
                    flush=True,
                )

            # ==================================================
            # COMMIT POR LOTES
            # ==================================================

            if procesados % BATCH_SIZE == 0:

                print(
                    f"IMPORTADOR: guardando lote "
                    f"{procesados // BATCH_SIZE}...",
                    flush=True,
                )

                db.commit()

        except Exception as e:

            errores += 1

            print(
                f"ERROR PROCESANDO EXPEDIENTE "
                f"{idexp}: {e}",
                flush=True,
            )

            db.rollback()

            # Reconstruimos el mapa únicamente con registros
            # que realmente existen en BD.

            existentes_db = (
                db.query(Expediente)
                .filter(
                    Expediente.id_expediente.in_(
                        list(existentes_por_id.keys())
                    )
                )
                .all()
            )

            existentes_por_id = {
                str(exp.id_expediente).strip(): exp
                for exp in existentes_db
            }

    # ========================================================
    # COMMIT FINAL
    # ========================================================

    try:

        db.commit()

    except Exception as e:

        print(
            f"ERROR EN COMMIT FINAL: {e}",
            flush=True,
        )

        db.rollback()

        raise

    # ========================================================
    # RESULTADO
    # ========================================================

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - FINALIZADO", flush=True)
    print(f"FECHA: {fecha_objetivo}", flush=True)
    print(f"FILAS ENCONTRADAS: {total_filtrados}", flush=True)
    print(f"PROCESADOS: {procesados}", flush=True)
    print(f"CREADOS: {creados}", flush=True)
    print(f"ACTUALIZADOS: {actualizados}", flush=True)
    print(f"ERRORES: {errores}", flush=True)
    print("============================================", flush=True)

    return {
        "creados": creados,
        "actualizados": actualizados,
        "errores": errores,
        "fecha_importada": fecha_objetivo.isoformat(),
        "total_filtrados": total_filtrados,
        "total_procesados": procesados,
    }
