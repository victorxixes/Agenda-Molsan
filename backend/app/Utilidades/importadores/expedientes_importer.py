import io
import math
from datetime import date, datetime

import pandas as pd
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente


# ============================================================
# CONFIGURACIÓN
# ============================================================

BATCH_SIZE = 500


# ============================================================
# UTILIDADES
# ============================================================

def limpiar_nombre_columna(valor):
    """
    Normaliza nombres de columnas del Excel.
    """

    if valor is None:
        return ""

    return str(valor).strip().upper()


def limpiar_valor(valor):
    """
    Convierte valores de pandas a valores compatibles
    con SQLAlchemy.
    """

    if valor is None:
        return None

    try:
        if pd.isna(valor):
            return None
    except Exception:
        pass

    if isinstance(valor, pd.Timestamp):
        return valor.date()

    if isinstance(valor, datetime):
        return valor.date()

    if isinstance(valor, float):
        if math.isnan(valor) or math.isinf(valor):
            return None

    return valor


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
    Convierte una fecha del Excel a datetime.date.

    El formato habitual del Excel ABSIS es:

        DD/MM/YYYY

    Ejemplo:

        08/11/2025
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

    formatos = [
        "%d/%m/%Y",
        "%d/%m/%Y %H:%M:%S",
        "%d-%m-%Y",
        "%Y-%m-%d",
        "%Y-%m-%d %H:%M:%S",
    ]

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

    IMPORTANTE:

    El Excel puede contener más de 100.000 filas.

    El proceso es:

        1. Leer Excel una sola vez.
        2. Normalizar columnas.
        3. Convertir FECHAALTA.
        4. Filtrar la fecha solicitada.
        5. Solo después consultar la base de datos.
        6. Crear/actualizar expedientes.
        7. Guardar por lotes.

    No se generan ExpedienteDetalle.
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
        flush=True
    )

    print(
        f"TAMAÑO DEL FICHERO: {len(contenido_excel)} bytes",
        flush=True
    )

    # ========================================================
    # 2) VALIDAR FICHERO
    # ========================================================

    if not contenido_excel:

        raise ValueError(
            "El fichero Excel está vacío."
        )

    # ========================================================
    # 3) LEER EXCEL
    # ========================================================

    print(
        "IMPORTADOR: leyendo Excel...",
        flush=True
    )

    try:

        df = pd.read_excel(
            io.BytesIO(contenido_excel),
            sheet_name=0,
            engine="openpyxl"
        )

    except Exception as e:

        print(
            f"ERROR LEYENDO EXCEL: {e}",
            flush=True
        )

        raise ValueError(
            "No se pudo leer el archivo Excel."
        )

    # ========================================================
    # 4) INFORMACIÓN DEL EXCEL
    # ========================================================

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
    # 5) NORMALIZAR COLUMNAS
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
    # 6) COMPROBAR COLUMNAS
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
    # 7) MOSTRAR PRIMERAS FILAS
    # ========================================================

    print(
        "IMPORTADOR: primeras filas del Excel:",
        flush=True
    )

    print(
        df[
            ["IDEXPEDIENTE", "FECHAALTA"]
        ].head(5).to_string(index=False),
        flush=True
    )

    # ========================================================
    # 8) CONVERTIR FECHAALTA
    # ========================================================

    print(
        "IMPORTADOR: convirtiendo FECHAALTA...",
        flush=True
    )

    df["FECHAALTA"] = df["FECHAALTA"].apply(
        convertir_fecha
    )

    fechas_validas = int(
        df["FECHAALTA"].notna().sum()
    )

    print(
        f"FECHAS VÁLIDAS: {fechas_validas}",
        flush=True
    )

    # ========================================================
    # 9) FILTRAR FECHA
    # ========================================================

    print(
        "IMPORTADOR: filtrando únicamente la fecha "
        f"{fecha_objetivo}...",
        flush=True
    )

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
    # 10) MOSTRAR PRIMEROS RESULTADOS
    # ========================================================

    if total_filtrados > 0:

        print(
            "PRIMEROS EXPEDIENTES ENCONTRADOS:",
            flush=True
        )

        print(
            df_filtrado[
                ["IDEXPEDIENTE", "FECHAALTA"]
            ]
            .head(10)
            .to_string(index=False),
            flush=True
        )

    # ========================================================
    # 11) NO HAY DATOS
    # ========================================================

    if total_filtrados == 0:

        print(
            "IMPORTADOR: no se encontraron expedientes "
            "para la fecha indicada.",
            flush=True
        )

        # Mostrar fechas existentes para diagnóstico.
        print(
            "ALGUNAS FECHAS ENCONTRADAS EN EL EXCEL:",
            flush=True
        )

        fechas = (
            df["FECHAALTA"]
            .dropna()
            .value_counts()
            .head(20)
        )

        for fecha, cantidad in fechas.items():

            print(
                f"  {fecha}: {cantidad}",
                flush=True
            )

        print("============================================", flush=True)
        print("IMPORTADOR ABSIS - FINALIZADO SIN DATOS", flush=True)
        print("============================================", flush=True)

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
    # 13) OBTENER IDS ÚNICOS
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
    # 14) CONSULTAR BD
    # ========================================================

    print(
        "IMPORTADOR: comprobando expedientes existentes...",
        flush=True
    )

    existentes_por_id = {}

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
    # 16) PROCESAMIENTO
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

