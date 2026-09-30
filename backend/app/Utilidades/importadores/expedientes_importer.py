import io
import math
from datetime import date, datetime

import openpyxl
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

def limpiar_nombre_columna(valor):
    """
    Normaliza el nombre de una columna.

    Ejemplos:
        "FECHAALTA"      -> "FECHAALTA"
        " FECHAALTA "    -> "FECHAALTA"
        "FechaAlta"      -> "FECHAALTA"
        "IDEXPEDIENTE "  -> "IDEXPEDIENTE"
    """

    if valor is None:
        return ""

    return str(valor).strip().upper()


def limpiar_valor(valor):
    """
    Convierte valores de pandas/numpy a valores seguros
    para SQLAlchemy.
    """

    if valor is None:
        return None

    try:
        if pd.isna(valor):
            return None
    except Exception:
        pass

    # Convertir timestamps de pandas a date
    if isinstance(valor, pd.Timestamp):
        return valor.date()

    # Convertir datetime a date cuando corresponda
    if isinstance(valor, datetime):
        return valor.date()

    # Evitar NaN / infinito
    if isinstance(valor, float):
        if math.isnan(valor) or math.isinf(valor):
            return None

    return valor


def obtener_valor(row, *columnas):
    """
    Obtiene el primer valor disponible de las columnas indicadas.
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
    Convierte cualquier fecha razonable a date.

    El Excel ABSIS utiliza normalmente:
        DD/MM/YYYY

    pero también aceptamos fechas que pandas/openpyxl
    ya haya convertido.
    """

    valor = limpiar_valor(valor)

    if valor is None:
        return None

    if isinstance(valor, date) and not isinstance(valor, datetime):
        return valor

    if isinstance(valor, datetime):
        return valor.date()

    if isinstance(valor, pd.Timestamp):
        return valor.date()

    texto = str(valor).strip()

    if not texto:
        return None

    # Primero formato habitual ABSIS
    try:
        return datetime.strptime(
            texto,
            "%d/%m/%Y"
        ).date()
    except ValueError:
        pass

    # Otros formatos habituales
    formatos = (
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%d/%m/%Y %H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
    )

    for formato in formatos:
        try:
            return datetime.strptime(
                texto,
                formato
            ).date()
        except ValueError:
            continue

    # Último intento con pandas
    try:
        fecha = pd.to_datetime(
            texto,
            dayfirst=True,
            errors="coerce"
        )

        if pd.isna(fecha):
            return None

        return fecha.date()

    except Exception:
        return None


# ============================================================
# IMPORTADOR PRINCIPAL
# ============================================================

def importar_excel_expedientes(
    db: Session,
    contenido_excel: bytes,
    fecha_objetivo: date = None
):
    """
    Importa expedientes desde el Excel matriz ABSIS.

    El Excel puede tener más de 100.000 filas.

    El proceso es:

        1. Abrir Excel.
        2. Detectar la hoja que contiene IDEXPEDIENTE y FECHAALTA.
        3. Normalizar las columnas.
        4. Leer los datos.
        5. Convertir FECHAALTA.
        6. Filtrar SOLO la fecha solicitada.
        7. Importar únicamente esas filas.
        8. Guardar por lotes.

    No se generan ExpedienteDetalle.
    """

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - INICIO", flush=True)
    print("============================================", flush=True)

    # ========================================================
    # 0) FECHA OBJETIVO
    # ========================================================

    if fecha_objetivo is None:
        fecha_objetivo = date.today()

    print(
        f"FECHA OBJETIVO: {fecha_objetivo}",
        flush=True
    )

    print(
        f"TAMAÑO DEL FICHERO: {len(contenido_excel)} bytes",
        flush=True
    )

    # ========================================================
    # 1) VALIDAR FICHERO
    # ========================================================

    if not contenido_excel:
        raise ValueError(
            "El fichero Excel está vacío."
        )

    # ========================================================
    # 2) ABRIR LIBRO EXCEL
    # ========================================================

    print(
        "IMPORTADOR: abriendo libro Excel...",
        flush=True
    )

    try:
        wb = openpyxl.load_workbook(
            io.BytesIO(contenido_excel),
            read_only=True,
            data_only=True
        )

    except Exception as e:

        print(
            f"ERROR ABRIENDO EXCEL: {e}",
            flush=True
        )

        raise ValueError(
            "No se pudo abrir el fichero Excel."
        )

    hojas = wb.sheetnames

    print(
        f"HOJAS ENCONTRADAS: {hojas}",
        flush=True
    )

    # ========================================================
    # 3) LOCALIZAR HOJA CORRECTA
    # ========================================================

    hoja_seleccionada = None
    columnas_normalizadas = None

    for nombre_hoja in hojas:

        print(
            f"IMPORTADOR: inspeccionando hoja '{nombre_hoja}'...",
            flush=True
        )

        ws = wb[nombre_hoja]

        try:
            primera_fila = next(
                ws.iter_rows(
                    min_row=1,
                    max_row=1,
                    values_only=True
                )
            )
        except StopIteration:
            print(
                f"HOJA '{nombre_hoja}': vacía.",
                flush=True
            )
            continue

        columnas = list(primera_fila)

        columnas_limpias = [
            limpiar_nombre_columna(c)
            for c in columnas
        ]

        print(
            f"HOJA '{nombre_hoja}' - COLUMNAS: "
            f"{columnas_limpias}",
            flush=True
        )

        tiene_id = "IDEXPEDIENTE" in columnas_limpias
        tiene_fecha = "FECHAALTA" in columnas_limpias

        print(
            f"HOJA '{nombre_hoja}' - "
            f"IDEXPEDIENTE={tiene_id} "
            f"FECHAALTA={tiene_fecha}",
            flush=True
        )

        if tiene_id and tiene_fecha:

            hoja_seleccionada = nombre_hoja
            columnas_normalizadas = columnas_limpias

            break

    # ========================================================
    # 4) VALIDAR HOJA
    # ========================================================

    if hoja_seleccionada is None:

        print(
            "IMPORTADOR: no se ha encontrado ninguna hoja "
            "válida.",
            flush=True
        )

        print(
            "IMPORTADOR: hojas disponibles:",
            hojas,
            flush=True
        )

        wb.close()

        raise ValueError(
            "No se ha encontrado ninguna hoja que contenga "
            "las columnas FECHAALTA e IDEXPEDIENTE."
        )

    print(
        f"HOJA SELECCIONADA: {hoja_seleccionada}",
        flush=True
    )

    print(
        f"COLUMNAS NORMALIZADAS: {columnas_normalizadas}",
        flush=True
    )

    wb.close()

    # ========================================================
    # 5) LEER ÚNICAMENTE LA HOJA CORRECTA
    # ========================================================

    print(
        "IMPORTADOR: leyendo datos de la hoja seleccionada...",
        flush=True
    )

    try:

        df = pd.read_excel(
            io.BytesIO(contenido_excel),
            sheet_name=hoja_seleccionada,
            engine="openpyxl"
        )

    except Exception as e:

        print(
            f"ERROR LEYENDO HOJA: {e}",
            flush=True
        )

        raise ValueError(
            "No se pudo leer la hoja de datos del Excel."
        )

    print(
        "IMPORTADOR: Excel leído correctamente.",
        flush=True
    )

    print(
        f"TOTAL FILAS EXCEL: {len(df)}",
        flush=True
    )

    print(
        f"TOTAL COLUMNAS EXCEL: {len(df.columns)}",
        flush=True
    )

    print(
        f"COLUMNAS ORIGINALES: {list(df.columns)}",
        flush=True
    )

    # ========================================================
    # 6) NORMALIZAR COLUMNAS DEL DATAFRAME
    # ========================================================

    df.columns = [
        limpiar_nombre_columna(col)
        for col in df.columns
    ]

    print(
        f"COLUMNAS NORMALIZADAS: {list(df.columns)}",
        flush=True
    )

    # ========================================================
    # 7) COMPROBAR COLUMNAS
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
    # 8) MOSTRAR PRIMERAS FECHAS
    # ========================================================

    print(
        "IMPORTADOR: primeras FECHAALTA detectadas:",
        flush=True
    )

    print(
        df["FECHAALTA"].head(10).tolist(),
        flush=True
    )

    # ========================================================
    # 9) CONVERTIR FECHAALTA
    # ========================================================

    print(
        "IMPORTADOR: convirtiendo FECHAALTA...",
        flush=True
    )

    df["FECHAALTA"] = df["FECHAALTA"].apply(
        convertir_fecha
    )

    fechas_validas = df["FECHAALTA"].notna().sum()

    print(
        f"FECHAS VÁLIDAS: {fechas_validas}",
        flush=True
    )

    print(
        "IMPORTADOR: buscando expedientes del día "
        f"{fecha_objetivo}...",
        flush=True
    )

    # ========================================================
    # 10) FILTRAR ANTES DE PROCESAR
    # ========================================================

    df_filtrado = df[
        df["FECHAALTA"] == fecha_objetivo
    ].copy()

    total_filtrados = len(df_filtrado)

    print(
        f"FILAS ENCONTRADAS PARA {fecha_objetivo}: "
        f"{total_filtrados}",
        flush=True
    )

    # ========================================================
    # 11) SI NO HAY DATOS
    # ========================================================

    if total_filtrados == 0:

        # Mostrar las fechas más recientes encontradas
        fechas = (
            df["FECHAALTA"]
            .dropna()
            .value_counts()
            .head(10)
        )

        print(
            "IMPORTADOR: no se encontraron expedientes "
            "para la fecha indicada.",
            flush=True
        )

        print(
            "FECHAS ENCONTRADAS MÁS FRECUENTES:",
            flush=True
        )

        for fecha, cantidad in fechas.items():

            print(
                f"  {fecha}: {cantidad}",
                flush=True
            )

        print(
            "============================================",
            flush=True
        )

        print(
            "IMPORTADOR ABSIS - FINALIZADO SIN DATOS",
            flush=True
        )

        print(
            "============================================",
            flush=True
        )

        return {
            "creados": 0,
            "actualizados": 0,
            "errores": 0,
            "fecha_importada": fecha_objetivo.isoformat(),
            "total_filtrados": 0,
            "total_procesados": 0
        }

    # ========================================================
    # 12) LIMPIAR IDEXPEDIENTE
    # ========================================================

    df_filtrado["IDEXPEDIENTE"] = (
        df_filtrado["IDEXPEDIENTE"]
        .apply(limpiar_valor)
        .astype("string")
        .str.strip()
    )

    df_filtrado = df_filtrado[
        df_filtrado["IDEXPEDIENTE"].notna()
        & (df_filtrado["IDEXPEDIENTE"] != "")
        & (df_filtrado["IDEXPEDIENTE"] != "nan")
    ].copy()

    total_filtrados = len(df_filtrado)

    print(
        f"EXPEDIENTES CON IDEXPEDIENTE VÁLIDO: "
        f"{total_filtrados}",
        flush=True
    )

    if total_filtrados == 0:

        return {
            "creados": 0,
            "actualizados": 0,
            "errores": 0,
            "fecha_importada": fecha_objetivo.isoformat(),
            "total_filtrados": 0,
            "total_procesados": 0
        }

    # ========================================================
    # 13) IDS ÚNICOS
    # ========================================================

    ids_excel = (
        df_filtrado["IDEXPEDIENTE"]
        .drop_duplicates()
        .tolist()
    )

    print(
        f"IDEXPEDIENTE ÚNICOS: {len(ids_excel)}",
        flush=True
    )

    # ========================================================
    # 14) BUSCAR EXISTENTES
    # ========================================================

    print(
        "IMPORTADOR: comprobando expedientes existentes...",
        flush=True
    )

    existentes_por_id = {}

    # Evitamos una consulta IN gigantesca si algún día
    # se selecciona una fecha con muchísimos expedientes.

    for inicio in range(
        0,
        len(ids_excel),
        BATCH_SIZE
    ):

        bloque_ids = ids_excel[
            inicio:inicio + BATCH_SIZE
        ]

        existentes = (
            db.query(Expediente)
            .filter(
                Expediente.id_expediente.in_(bloque_ids)
            )
            .all()
        )

        for exp in existentes:

            existentes_por_id[
                exp.id_expediente
            ] = exp

    print(
        f"EXPEDIENTES YA EXISTENTES: "
        f"{len(existentes_por_id)}",
        flush=True
    )

    # ========================================================
    # 15) CONTADORES
    # ========================================================

    creados = 0
    actualizados = 0
    errores = 0
    procesados = 0

    # ========================================================
    # 16) PROCESAR
    # ========================================================

    print(
        "IMPORTADOR: comenzando procesamiento...",
        flush=True
    )

    for _, row in df_filtrado.iterrows():

        idexp = str(
            row["IDEXPEDIENTE"]
        ).strip()

        try:

            # ------------------------------------------------
            # BUSCAR EXISTENTE
            # ------------------------------------------------

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

            # ------------------------------------------------
            # ACTUALIZAR
            # ------------------------------------------------

            else:

                actualizados += 1

            # ------------------------------------------------
            # FECHAS
            # ------------------------------------------------

            exp.fecha_alta = convertir_fecha(
                obtener_valor(row, "FECHAALTA")
            )

            exp.fecha_firma = convertir_fecha(
                obtener_valor(row, "FECHAFIRMA")
            )

            exp.fecha_inscripcion = convertir_fecha(
                obtener_valor(row, "FECHAINSCRIPCION")
            )

            exp.fecha_entregado_cliente = convertir_fecha(
                obtener_valor(row, "FECHAENTREGADOCLIENTE")
            )

            exp.fecha_prevista_firma = convertir_fecha(
                obtener_valor(row, "FECHAPREVISTAFIRMA")
            )

            exp.fecha_vencimiento = convertir_fecha(
                obtener_valor(row, "FECHAVENCIMIENTO")
            )

            exp.fecha_sol_cgn = convertir_fecha(
                obtener_valor(row, "FECHASOLCGN")
            )

            exp.fecha_firma_prev_val = convertir_fecha(
                obtener_valor(row, "FECHAFIRMAPREVVAL")
            )

            exp.fecha_firma_prev_cli = convertir_fecha(
                obtener_valor(row, "FECHAFIRMAPREVCLI")
            )

            # ------------------------------------------------
            # ESTADOS
            # ------------------------------------------------

            exp.estado_expediente = obtener_valor(
                row,
                "ESTADOEXPEDIENTE"
            )

            exp.estado_expediente_ancert = obtener_valor(
                row,
                "ESTADOEXPEDIENTEANCERT"
            )

            # ------------------------------------------------
            # ACTIVIDAD
            # ------------------------------------------------

            exp.actividad_actual = obtener_valor(
                row,
                "ACTIVIDADACTUAL"
            )

            exp.estado_actividad = obtener_valor(
                row,
                "ESTADOACTIVIDAD"
            )

            exp.fecha_inicio_actividad = convertir_fecha(
                obtener_valor(
                    row,
                    "FECHAINICIOACTIVIDAD"
                )
            )

            exp.fecha_fin_actividad = convertir_fecha(
                obtener_valor(
                    row,
                    "FECHAFINACTIVIDAD"
                )
            )

            # ------------------------------------------------
            # TITULAR
            # ------------------------------------------------

            exp.nombre_titular = obtener_valor(
                row,
                "NOMBRETITULAR"
            )

            exp.nif_titular = obtener_valor(
                row,
                "NIFTITULAR"
            )

            # ------------------------------------------------
            # NOTARIO
            # ------------------------------------------------

            exp.nombre_notario = obtener_valor(
                row,
                "NOMBRENOTARIO"
            )

            exp.nif_notario = obtener_valor(
                row,
                "NIFNOTARIO"
            )

            exp.notario = obtener_valor(
                row,
                "NOTARIO",
                "NOMBRENOTARIO"
            )

            # ------------------------------------------------
            # OFICINA
            # ------------------------------------------------

            exp.oficina = obtener_valor(
                row,
                "OFICINA"
            )

            exp.oficina_alta = obtener_valor(
                row,
                "OFICINAALTA"
            )

            exp.dan = obtener_valor(
                row,
                "DAN"
            )

            # ------------------------------------------------
            # ECONÓMICOS
            # ------------------------------------------------

            exp.capital = obtener_valor(
                row,
                "CAPITAL"
            )

            exp.importe = obtener_valor(
                row,
                "IMPORTE"
            )

            exp.saldo_real = obtener_valor(
                row,
                "SALDOREAL"
            )

            exp.saldo_disponible = obtener_valor(
                row,
                "SALDODISPONIBLE"
            )

            # ------------------------------------------------
            # OPERACIÓN
            # ------------------------------------------------

            exp.contrato = obtener_valor(
                row,
                "CONTRATO"
            )

            exp.num_solicitud_sia = obtener_valor(
                row,
                "NUMSOLICITUDSIA"
            )

            exp.tipo_operacion = obtener_valor(
                row,
                "TIPOOPERACION"
            )

            exp.subtipo_operacion = obtener_valor(
                row,
                "SUBTIPOOPERACION"
            )

            exp.vinccanc = obtener_valor(
                row,
                "VINCCANC"
            )

            exp.protocolo = obtener_valor(
                row,
                "PROTOCOLO"
            )

            # ------------------------------------------------
            # GTG / BANKIA
            # ------------------------------------------------

            exp.origen_bankia = obtener_valor(
                row,
                "ORIGENBANKIA"
            )

            exp.producto_gtg = obtener_valor(
                row,
                "PRODUCTOGTG"
            )

            exp.dt = obtener_valor(
                row,
                "DT"
            )

            # ------------------------------------------------
            # GESTORÍA
            # ------------------------------------------------

            exp.gestoria = obtener_valor(
                row,
                "NOMBREGESTORIA",
                "GESTORIA"
            )

            # ------------------------------------------------
            # CGN
            # ------------------------------------------------

            exp.id_expediente_cgn = obtener_valor(
                row,
                "IDEXPEDIENTECGN"
            )

            # ------------------------------------------------
            # OTROS
            # ------------------------------------------------

            exp.lucy = obtener_valor(
                row,
                "LUCY"
            )

            exp.indicador_tt = obtener_valor(
                row,
                "INDICADORTT"
            )

            # ------------------------------------------------
            # OBSERVACIONES
            # ------------------------------------------------

            exp.observaciones = obtener_valor(
                row,
                "OBSERVACIONES"
            )

            # ------------------------------------------------
            # CONTADOR
            # ------------------------------------------------

            procesados += 1

            # ------------------------------------------------
            # PROGRESO
            # ------------------------------------------------

            if procesados == 1:

                print(
                    f"PRIMER EXPEDIENTE PROCESADO: {idexp}",
                    flush=True
                )

            if procesados % 100 == 0:

                print(
                    f"PROGRESO: "
                    f"{procesados}/{total_filtrados} "
                    f"| creados={creados} "
                    f"| actualizados={actualizados} "
                    f"| errores={errores}",
                    flush=True
                )

            # ------------------------------------------------
            # COMMIT POR LOTES
            # ------------------------------------------------

            if procesados % BATCH_SIZE == 0:

                print(
                    f"IMPORTADOR: guardando lote "
                    f"{procesados // BATCH_SIZE}...",
                    flush=True
                )

                db.commit()

        except Exception as e:

            errores += 1

            print(
                f"ERROR PROCESANDO EXPEDIENTE "
                f"{idexp}: {e}",
                flush=True
            )

            db.rollback()

    # ========================================================
    # 17) COMMIT FINAL
    # ========================================================

    print(
        "IMPORTADOR: realizando commit final...",
        flush=True
    )

    try:

        db.commit()

    except Exception as e:

        print(
            f"ERROR EN COMMIT FINAL: {e}",
            flush=True
        )

        db.rollback()

        raise

    # ========================================================
    # 18) RESULTADO
    # ========================================================

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - FINALIZADO", flush=True)
    print(f"FECHA: {fecha_objetivo}", flush=True)
    print(f"FILAS FILTRADAS: {total_filtrados}", flush=True)
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
        "total_procesados": procesados
    }
