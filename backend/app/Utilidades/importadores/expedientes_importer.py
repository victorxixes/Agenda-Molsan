import io
from datetime import date, datetime
from typing import Any, Optional

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
    Convierte valores procedentes de pandas/Excel
    a valores Python utilizables.

    Convierte:
    - NaN -> None
    - NaT -> None
    - Timestamp -> datetime
    - cadenas vacías -> None
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


def limpiar_texto(valor: Any) -> Optional[str]:
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
    Devuelve el primer valor válido encontrado entre
    las columnas indicadas.

    Permite soportar pequeñas variaciones de nombres
    de columnas del Excel ABSIS.
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


def convertir_fecha(valor: Any) -> Optional[date]:
    """
    Convierte un valor del Excel a date.

    Soporta:

    - datetime
    - date
    - pandas.Timestamp
    - 08/11/2025
    - 08/11/2025 00:00:00
    - 2025-11-08
    - valores Excel reconocidos por pandas
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


def convertir_numero(valor: Any):
    """
    Convierte valores económicos del Excel a float.

    Soporta:

    1234.56
    "1234.56"
    "1.234,56"
    "1234,56"

    Evita guardar NaN.
    """

    valor = limpiar_valor(valor)

    if valor is None:
        return None

    if isinstance(valor, str):

        valor = valor.strip()

        if not valor:
            return None

        # ----------------------------------------------------
        # Formato español:
        #
        # 1.234,56 -> 1234.56
        # ----------------------------------------------------

        if "," in valor:

            valor = (
                valor
                .replace(".", "")
                .replace(",", ".")
            )

        else:

            # ------------------------------------------------
            # Si no hay coma, mantenemos el punto decimal.
            # ------------------------------------------------

            valor = valor.replace(" ", "")

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

    El Excel puede contener un histórico grande.

    IMPORTANTE:

    Solamente se procesan las filas cuya FECHAALTA
    coincide con fecha_objetivo.

    Si fecha_objetivo no se indica:
        se utiliza date.today().

    Los expedientes se crean o actualizan utilizando
    IDEXPEDIENTE como identificador único.

    No se crean ExpedienteDetalle.
    Los datos se guardan directamente en Expediente.
    """

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - INICIO", flush=True)
    print("============================================", flush=True)

    # ========================================================
    # 1) FECHA OBJETIVO
    # ========================================================

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
    # 2) LEER EXCEL
    # ========================================================

    print(
        "IMPORTADOR: leyendo Excel...",
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
    # 3) NORMALIZAR COLUMNAS
    # ========================================================

    df.columns = [
        str(col).strip().upper()
        for col in df.columns
    ]

    print(
        "COLUMNAS DEL EXCEL:",
        flush=True,
    )

    print(
        list(df.columns),
        flush=True,
    )

    # ========================================================
    # 4) COMPROBAR COLUMNAS OBLIGATORIAS
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
    # 5) CONVERTIR FECHAALTA
    # ========================================================

    print(
        "IMPORTADOR: convirtiendo FECHAALTA...",
        flush=True,
    )

    df["FECHAALTA"] = pd.to_datetime(
        df["FECHAALTA"],
        dayfirst=True,
        errors="coerce",
    )

    fechas_validas = int(
        df["FECHAALTA"].notna().sum()
    )

    print(
        f"FECHAS VÁLIDAS: {fechas_validas}",
        flush=True,
    )

    # ========================================================
    # 6) FILTRAR POR FECHA
    # ========================================================

    print(
        f"IMPORTADOR: filtrando por {fecha_objetivo}...",
        flush=True,
    )

    fecha_timestamp = pd.Timestamp(
        fecha_objetivo
    )

    df_filtrado = df[
        df["FECHAALTA"].dt.normalize()
        == fecha_timestamp
    ].copy()

    total_filtrados_inicial = len(
        df_filtrado
    )

    print(
        f"FILAS ENCONTRADAS PARA "
        f"{fecha_objetivo}: "
        f"{total_filtrados_inicial}",
        flush=True,
    )

    # ========================================================
    # SI NO HAY FILAS
    # ========================================================

    if df_filtrado.empty:

        print(
            "IMPORTADOR: no existen expedientes "
            "para la fecha indicada.",
            flush=True,
        )

        return {
            "creados": 0,
            "actualizados": 0,
            "errores": 0,
            "fecha_importada": fecha_objetivo.isoformat(),
            "total_filtrados": 0,
            "total_procesados": 0,
        }

    # ========================================================
    # 7) LIMPIAR IDEXPEDIENTE
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

    total_filtrados = len(
        df_filtrado
    )

    print(
        f"FILAS VÁLIDAS CON IDEXPEDIENTE: "
        f"{total_filtrados}",
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
    # 8) IDS ÚNICOS
    # ========================================================

    ids_excel = (
        df_filtrado["IDEXPEDIENTE"]
        .drop_duplicates()
        .tolist()
    )

    print(
        f"EXPEDIENTES ÚNICOS EN EXCEL: "
        f"{len(ids_excel)}",
        flush=True,
    )

    # ========================================================
    # 9) BUSCAR EXPEDIENTES EXISTENTES
    #
    # Se hace por bloques para no generar una consulta SQL
    # gigantesca.
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

            clave = limpiar_texto(
                exp.id_expediente
            )

            if clave:

                existentes_por_id[
                    clave
                ] = exp

    print(
        f"EXPEDIENTES YA EXISTENTES: "
        f"{len(existentes_por_id)}",
        flush=True,
    )

    # ========================================================
    # 10) CONTADORES
    # ========================================================

    creados = 0
    actualizados = 0
    errores = 0
    procesados = 0

    # ========================================================
    # 11) PROCESAR FILAS
    # ========================================================

    for _, row in df_filtrado.iterrows():

        idexp = limpiar_texto(
            row.get("IDEXPEDIENTE")
        )

        if not idexp:
            continue

        try:

            # =================================================
            # BUSCAR EXPEDIENTE
            # =================================================

            exp = existentes_por_id.get(
                idexp
            )

            # =================================================
            # CREAR
            # =================================================

            if exp is None:

                exp = Expediente(
                    id_expediente=idexp
                )

                db.add(exp)

                existentes_por_id[
                    idexp
                ] = exp

                creados += 1

            # =================================================
            # ACTUALIZAR
            # =================================================

            else:

                actualizados += 1

            # =================================================
            # ESTADOS
            # =================================================

            exp.estado_expediente = obtener_valor(
                row,
                "ESTADOEXPEDIENTE",
                "ESTADO_EXPEDIENTE",
            )

            exp.estado_expediente_ancert = obtener_valor(
                row,
                "ESTADOEXPEDIENTEANCERT",
                "ESTADO_EXPEDIENTE_ANCERT",
            )

            # =================================================
            # FECHAS
            # =================================================

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

            exp.fcierre_defecto = convertir_fecha(
                row.get("FCIERREDEFECTO")
            )

            # =================================================
            # TITULAR
            # =================================================

            exp.nombre_titular = obtener_valor(
                row,
                "NOMBRETITULAR",
                "NOMBRE_TITULAR",
            )

            exp.nif_titular = obtener_valor(
                row,
                "NIFTITULAR",
                "NIF_TITULAR",
            )

            # =================================================
            # SOLICITANTE
            # =================================================

            exp.nombre_solicitante = obtener_valor(
                row,
                "NOMBRESOLICITANTE",
                "NOMBRE_SOLICITANTE",
            )

            exp.nif_solicitante = obtener_valor(
                row,
                "NIFSOLICITANTE",
                "NIF_SOLICITANTE",
            )

            # =================================================
            # APODERADO
            # =================================================

            exp.apoderado = obtener_valor(
                row,
                "APODERADO",
            )

            # =================================================
            # NOTARIO
            # =================================================

            exp.nombre_notario = obtener_valor(
                row,
                "NOMBRENOTARIO",
                "NOMBRE_NOTARIO",
            )

            exp.nif_notario = obtener_valor(
                row,
                "NIFNOTARIO",
                "NIF_NOTARIO",
            )

            exp.notario = obtener_valor(
                row,
                "NOTARIO",
                "NOMBRENOTARIO",
                "NOMBRE_NOTARIO",
            )

            # =================================================
            # OFICINA
            # =================================================

            exp.oficina = obtener_valor(
                row,
                "OFICINA",
            )

            exp.dan = obtener_valor(
                row,
                "DAN",
            )

            exp.oficina_alta = obtener_valor(
                row,
                "OFICINAALTA",
                "OFICINA_ALTA",
            )

            # =================================================
            # ECONÓMICOS
            # =================================================

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

            # =================================================
            # PROVISIÓN
            # =================================================

            exp.id_provision = obtener_valor(
                row,
                "IDPROVISION",
                "ID_PROVISION",
            )

            exp.tipo_provision = obtener_valor(
                row,
                "TIPOPROVISION",
                "TIPO_PROVISION",
            )

            # =================================================
            # OPERACIÓN
            # =================================================

            exp.contrato = obtener_valor(
                row,
                "CONTRATO",
            )

            exp.num_solicitud_sia = obtener_valor(
                row,
                "NUMSOLICITUDSIA",
                "NUM_SOLICITUD_SIA",
            )

            exp.tipo_operacion = obtener_valor(
                row,
                "TIPOOPERACION",
                "TIPO_OPERACION",
            )

            exp.subtipo_operacion = obtener_valor(
                row,
                "SUBTIPOOPERACION",
                "SUBTIPO_OPERACION",
            )

            exp.vinccanc = obtener_valor(
                row,
                "VINCCANC",
            )

            exp.protocolo = obtener_valor(
                row,
                "PROTOCOLO",
            )

            # =================================================
            # GTG / BANKIA
            # =================================================

            exp.origen_bankia = obtener_valor(
                row,
                "ORIGENBANKIA",
                "ORIGEN_BANKIA",
            )

            exp.producto_gtg = obtener_valor(
                row,
                "PRODUCTOGTG",
                "PRODUCTO_GTG",
            )

            exp.dt = obtener_valor(
                row,
                "DT",
            )

            # =================================================
            # ACTIVIDAD
            # =================================================

            exp.actividad_actual = obtener_valor(
                row,
                "ACTIVIDADACTUAL",
                "ACTIVIDAD_ACTUAL",
            )

            exp.estado_actividad = obtener_valor(
                row,
                "ESTADOACTIVIDAD",
                "ESTADO_ACTIVIDAD",
            )

            # =================================================
            # GESTORÍA
            # =================================================

            exp.id_gestoria_tramite = obtener_valor(
                row,
                "IDGESTORIATRAMITE",
                "ID_GESTORIA_TRAMITE",
            )

            exp.nombre_gestoria = obtener_valor(
                row,
                "NOMBREGESTORIA",
                "NOMBRE_GESTORIA",
            )

            exp.gestoria = obtener_valor(
                row,
                "GESTORIA",
                "NOMBREGESTORIA",
                "NOMBRE_GESTORIA",
            )

            # =================================================
            # FINCA
            # =================================================

            exp.finca = obtener_valor(
                row,
                "FINCA",
            )

            # =================================================
            # DEFECTOS
            # =================================================

            exp.tiene_defectos_abiertos = obtener_valor(
                row,
                "TIENEDEFECTOSABIERTOS",
                "TIENE_DEFECTOS_ABIERTOS",
            )

            exp.tipo_error = obtener_valor(
                row,
                "TIPOERROR",
                "TIPO_ERROR",
            )

            exp.descripcion_error = obtener_valor(
                row,
                "DESCRIPCIONERROR",
                "DESCRIPCION_ERROR",
            )

            exp.falta_defecto = obtener_valor(
                row,
                "FALTADEFECTO",
                "FALTA_DEFECTO",
            )

            # =================================================
            # CGN
            # =================================================

            exp.id_expediente_cgn = obtener_valor(
                row,
                "IDEXPEDIENTECGN",
                "ID_EXPEDIENTE_CGN",
            )

            # =================================================
            # ACTA
            # =================================================

            exp.tipo_acta = obtener_valor(
                row,
                "TIPOACTA",
                "TIPO_ACTA",
            )

            # =================================================
            # OTROS
            # =================================================

            exp.lucy = obtener_valor(
                row,
                "LUCY",
            )

            exp.indicador_tt = obtener_valor(
                row,
                "INDICADORTT",
                "INDICADOR_TT",
            )

            # =================================================
            # OBSERVACIONES
            # =================================================

            exp.observaciones = obtener_valor(
                row,
                "OBSERVACIONES",
            )

            # =================================================
            # FACTURACIÓN
            # =================================================

            exp.facturacion_estado = obtener_valor(
                row,
                "FACTURACIONESTADO",
                "FACTURACION_ESTADO",
            )

            exp.facturacion_fecha = convertir_fecha(
                obtener_valor(
                    row,
                    "FACTURACIONFECHA",
                    "FACTURACION_FECHA",
                )
            )

            # =================================================
            # REGISTRAL
            # =================================================

            exp.registral_estado = obtener_valor(
                row,
                "REGISTRALESTADO",
                "REGISTRAL_ESTADO",
            )

            exp.registral_fecha = convertir_fecha(
                obtener_valor(
                    row,
                    "REGISTRALFECHA",
                    "REGISTRAL_FECHA",
                )
            )

            # =================================================
            # PROCESADO
            # =================================================

            procesados += 1

            if procesados % 25 == 0:

                print(
                    f"PROGRESO: "
                    f"{procesados}/{total_filtrados} "
                    f"| creados={creados} "
                    f"| actualizados={actualizados} "
                    f"| errores={errores}",
                    flush=True,
                )

            # =================================================
            # COMMIT POR LOTES
            # =================================================

            if procesados % BATCH_SIZE == 0:

                print(
                    f"IMPORTADOR: "
                    f"guardando lote "
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

            # ------------------------------------------------
            # IMPORTANTE:
            #
            # No hacemos rollback aquí porque podría
            # deshacer todo el lote de trabajo acumulado.
            #
            # El error de una fila se registra y continuamos.
            # ------------------------------------------------

            db.rollback()

            # ------------------------------------------------
            # Después del rollback SQLAlchemy puede haber
            # invalidado objetos pendientes. Reconstruimos
            # el mapa de expedientes existentes desde BD.
            # ------------------------------------------------

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

                for existente in existentes:

                    clave = limpiar_texto(
                        existente.id_expediente
                    )

                    if clave:

                        existentes_por_id[
                            clave
                        ] = existente

    # ========================================================
    # 12) COMMIT FINAL
    # ========================================================

    print(
        "IMPORTADOR: commit final...",
        flush=True,
    )

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
    # 13) RESULTADO
    # ========================================================

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - FINALIZADO", flush=True)
    print("============================================", flush=True)

    print(
        f"FECHA: {fecha_objetivo}",
        flush=True,
    )

    print(
        f"FILAS ENCONTRADAS: {total_filtrados}",
        flush=True,
    )

    print(
        f"PROCESADOS: {procesados}",
        flush=True,
    )

    print(
        f"CREADOS: {creados}",
        flush=True,
    )

    print(
        f"ACTUALIZADOS: {actualizados}",
        flush=True,
    )

    print(
        f"ERRORES: {errores}",
        flush=True,
    )

    print("============================================", flush=True)

    return {
        "creados": creados,
        "actualizados": actualizados,
        "errores": errores,
        "fecha_importada": fecha_objetivo.isoformat(),
        "total_filtrados": total_filtrados,
        "total_procesados": procesados,
    }
