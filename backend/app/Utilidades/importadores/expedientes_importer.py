
import io
from datetime import date

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

def valor_excel(row, *columnas):
    """
    Devuelve el primer valor válido encontrado entre las
    columnas indicadas.

    Permite soportar tanto los nombres reales del Excel
    como posibles variantes con guiones bajos.
    """

    for columna in columnas:

        if columna not in row.index:
            continue

        valor = row[columna]

        if pd.isna(valor):
            continue

        if isinstance(valor, str):

            valor = valor.strip()

            if not valor:
                continue

        return valor

    return None


def convertir_fecha(valor):
    """
    Convierte una fecha procedente del Excel a date.

    Soporta:
        - datetime
        - date
        - DD/MM/YYYY
        - YYYY-MM-DD
        - otros formatos reconocibles por pandas

    Si no se puede convertir devuelve None.
    """

    if valor is None or pd.isna(valor):
        return None

    if isinstance(valor, date):
        return valor

    try:

        fecha = pd.to_datetime(
            valor,
            dayfirst=True,
            errors="coerce"
        )

        if pd.isna(fecha):
            return None

        return fecha.date()

    except Exception:
        return None


def convertir_float(valor):
    """
    Convierte valores numéricos del Excel a float.

    Si no es posible convertir devuelve None.
    """

    if valor is None or pd.isna(valor):
        return None

    try:
        return float(valor)

    except (ValueError, TypeError):
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
    Importa únicamente los expedientes cuya FECHAALTA coincide
    con la fecha_objetivo.

    El Excel ABSIS puede contener más de 100.000 filas.

    Flujo:

        1. Leer Excel con pandas.
        2. Comprobar IDEXPEDIENTE y FECHAALTA.
        3. Convertir FECHAALTA.
        4. FILTRAR INMEDIATAMENTE por fecha.
        5. Procesar solamente las filas filtradas.
        6. Crear o actualizar Expediente.
        7. Commit por lotes.

    No genera ExpedienteDetalle.
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
    # 1) LEER EXCEL
    # ========================================================

    print(
        "IMPORTADOR: leyendo Excel con pandas...",
        flush=True
    )

    try:

        df = pd.read_excel(
            io.BytesIO(contenido_excel),
            engine="openpyxl"
        )

    except Exception as e:

        print(
            f"ERROR LEYENDO EXCEL: {e}",
            flush=True
        )

        raise ValueError(
            "No se pudo leer el archivo Excel. "
            "Formato inválido o archivo corrupto."
        )

    # ========================================================
    # 2) LIMPIAR NOMBRES DE COLUMNAS
    # ========================================================

    # Quitamos espacios accidentales de los nombres.
    df.columns = [
        str(col).strip()
        for col in df.columns
    ]

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
        f"COLUMNAS: {list(df.columns)}",
        flush=True
    )

    # ========================================================
    # 3) COMPROBAR COLUMNAS OBLIGATORIAS
    # ========================================================

    if "FECHAALTA" not in df.columns:

        print(
            "ERROR: No existe FECHAALTA.",
            flush=True
        )

        raise ValueError(
            "El Excel no contiene la columna FECHAALTA."
        )

    if "IDEXPEDIENTE" not in df.columns:

        print(
            "ERROR: No existe IDEXPEDIENTE.",
            flush=True
        )

        raise ValueError(
            "El Excel no contiene la columna IDEXPEDIENTE."
        )

    # ========================================================
    # 4) CONVERTIR FECHAALTA
    # ========================================================

    print(
        "IMPORTADOR: convirtiendo FECHAALTA...",
        flush=True
    )

    df["FECHAALTA"] = pd.to_datetime(
        df["FECHAALTA"],
        dayfirst=True,
        errors="coerce"
    ).dt.date

    fechas_validas = df["FECHAALTA"].notna().sum()

    print(
        f"FECHAS FECHAALTA VÁLIDAS: {fechas_validas}",
        flush=True
    )

    print(
        f"BUSCANDO FECHA EXACTA: {fecha_objetivo}",
        flush=True
    )

    # ========================================================
    # 5) FILTRAR INMEDIATAMENTE POR FECHA
    # ========================================================

    print(
        "IMPORTADOR: filtrando Excel por FECHAALTA...",
        flush=True
    )

    df_filtrado = df[
        df["FECHAALTA"] == fecha_objetivo
    ].copy()

    total_filtrados_inicial = len(df_filtrado)

    print(
        f"FILAS ENCONTRADAS PARA {fecha_objetivo}: "
        f"{total_filtrados_inicial}",
        flush=True
    )

    # ========================================================
    # 6) SI NO HAY DATOS
    # ========================================================

    if df_filtrado.empty:

        print(
            "IMPORTADOR: no existen altas para la fecha indicada.",
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
    # 7) LIMPIAR IDEXPEDIENTE
    # ========================================================

    df_filtrado["IDEXPEDIENTE"] = (
        df_filtrado["IDEXPEDIENTE"]
        .astype(str)
        .str.strip()
    )

    # Eliminamos valores inválidos.
    df_filtrado = df_filtrado[
        ~df_filtrado["IDEXPEDIENTE"].isin([
            "",
            "nan",
            "None",
            "NaN"
        ])
    ].copy()

    # Eliminamos duplicados del mismo expediente.
    df_filtrado = df_filtrado.drop_duplicates(
        subset=["IDEXPEDIENTE"],
        keep="last"
    )

    total_filtrados = len(df_filtrado)

    print(
        f"EXPEDIENTES VÁLIDOS PARA IMPORTAR: "
        f"{total_filtrados}",
        flush=True
    )

    # ========================================================
    # 8) MOSTRAR ALGUNOS IDS PARA COMPROBACIÓN
    # ========================================================

    ids_muestra = (
        df_filtrado["IDEXPEDIENTE"]
        .head(10)
        .tolist()
    )

    print(
        f"MUESTRA IDEXPEDIENTE: {ids_muestra}",
        flush=True
    )

    # ========================================================
    # 9) SI DESPUÉS DE LIMPIAR NO HAY DATOS
    # ========================================================

    if total_filtrados == 0:

        print(
            "IMPORTADOR: no quedan expedientes válidos "
            "después de limpiar IDEXPEDIENTE.",
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
    # 10) OBTENER IDS
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
    # 11) BUSCAR EXISTENTES EN UNA SOLA CONSULTA
    # ========================================================

    print(
        "IMPORTADOR: buscando expedientes existentes...",
        flush=True
    )

    expedientes_existentes = (
        db.query(Expediente)
        .filter(
            Expediente.id_expediente.in_(ids_excel)
        )
        .all()
    )

    existentes_por_id = {
        exp.id_expediente: exp
        for exp in expedientes_existentes
    }

    print(
        f"EXPEDIENTES YA EXISTENTES: "
        f"{len(existentes_por_id)}",
        flush=True
    )

    # ========================================================
    # 12) CONTADORES
    # ========================================================

    creados = 0
    actualizados = 0
    errores = 0
    procesados = 0

    # ========================================================
    # 13) PROCESAR SOLAMENTE LAS FILAS FILTRADAS
    # ========================================================

    print(
        "IMPORTADOR: procesando expedientes filtrados...",
        flush=True
    )

    for _, row in df_filtrado.iterrows():

        idexp = str(
            row["IDEXPEDIENTE"]
        ).strip()

        try:

            # ==================================================
            # BUSCAR EN MEMORIA
            # ==================================================

            exp = existentes_por_id.get(idexp)

            # ==================================================
            # CREAR
            # ==================================================

            if exp is None:

                exp = Expediente(
                    id_expediente=idexp
                )

                db.add(exp)

                existentes_por_id[idexp] = exp

                creados += 1

            # ==================================================
            # ACTUALIZAR
            # ==================================================

            else:

                actualizados += 1

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

            # ==================================================
            # ESTADOS
            # ==================================================

            exp.estado_expediente = valor_excel(
                row,
                "ESTADOEXPEDIENTE",
                "ESTADO_EXPEDIENTE"
            )

            exp.estado_expediente_ancert = valor_excel(
                row,
                "ESTADOEXPEDIENTEANCERT",
                "ESTADO_EXPEDIENTE_ANCERT"
            )

            # ==================================================
            # TITULAR
            # ==================================================

            exp.nombre_titular = valor_excel(
                row,
                "NOMBRETITULAR",
                "NOMBRE_TITULAR"
            )

            exp.nif_titular = valor_excel(
                row,
                "NIFTITULAR",
                "NIF_TITULAR"
            )

            # ==================================================
            # NOTARIO
            # ==================================================

            exp.nombre_notario = valor_excel(
                row,
                "NOMBRENOTARIO",
                "NOMBRE_NOTARIO"
            )

            exp.nif_notario = valor_excel(
                row,
                "NIFNOTARIO",
                "NIF_NOTARIO"
            )

            exp.notario = valor_excel(
                row,
                "NOTARIO",
                "NOMBRENOTARIO"
            )

            # ==================================================
            # OFICINA
            # ==================================================

            exp.oficina = valor_excel(
                row,
                "OFICINA"
            )

            exp.oficina_alta = valor_excel(
                row,
                "OFICINAALTA"
            )

            exp.dan = valor_excel(
                row,
                "DAN"
            )

            # ==================================================
            # ACTIVIDAD
            # ==================================================

            exp.actividad_actual = valor_excel(
                row,
                "ACTIVIDADACTUAL",
                "ACTIVIDAD_ACTUAL"
            )

            exp.estado_actividad = valor_excel(
                row,
                "ESTADOACTIVIDAD",
                "ESTADO_ACTIVIDAD"
            )

            exp.fecha_inicio_actividad = convertir_fecha(
                row.get("FECHAINICIOACTIVIDAD")
            )

            exp.fecha_fin_actividad = convertir_fecha(
                row.get("FECHAFINACTIVIDAD")
            )

            # ==================================================
            # ECONÓMICOS
            # ==================================================

            exp.capital = convertir_float(
                row.get("CAPITAL")
            )

            exp.importe = convertir_float(
                row.get("IMPORTE")
            )

            exp.saldo_real = convertir_float(
                row.get("SALDOREAL")
            )

            exp.saldo_disponible = convertir_float(
                row.get("SALDODISPONIBLE")
            )

            # ==================================================
            # OPERACIÓN
            # ==================================================

            exp.contrato = valor_excel(
                row,
                "CONTRATO"
            )

            exp.num_solicitud_sia = valor_excel(
                row,
                "NUMSOLICITUDSIA",
                "NUM_SOLICITUD_SIA"
            )

            exp.tipo_operacion = valor_excel(
                row,
                "TIPOOPERACION",
                "TIPO_OPERACION"
            )

            exp.subtipo_operacion = valor_excel(
                row,
                "SUBTIPOOPERACION",
                "SUBTIPO_OPERACION"
            )

            exp.vinccanc = valor_excel(
                row,
                "VINCCANC"
            )

            exp.protocolo = valor_excel(
                row,
                "PROTOCOLO"
            )

            # ==================================================
            # GTG / BANKIA
            # ==================================================

            exp.origen_bankia = valor_excel(
                row,
                "ORIGENBANKIA"
            )

            exp.producto_gtg = valor_excel(
                row,
                "PRODUCTOGTG",
                "PRODUCTO_GTG"
            )

            exp.dt = valor_excel(
                row,
                "DT"
            )

            # ==================================================
            # GESTORÍA
            # ==================================================

            # El Excel real contiene NOMBREGESTORIA.
            # También soportamos GESTORIA por compatibilidad.

            exp.gestoria = valor_excel(
                row,
                "NOMBREGESTORIA",
                "GESTORIA"
            )

            # ==================================================
            # CGN
            # ==================================================

            exp.id_expediente_cgn = valor_excel(
                row,
                "IDEXPEDIENTECGN",
                "ID_EXPEDIENTE_CGN"
            )

            # ==================================================
            # OTROS
            # ==================================================

            exp.lucy = valor_excel(
                row,
                "LUCY"
            )

            exp.indicador_tt = valor_excel(
                row,
                "INDICADORTT"
            )

            # ==================================================
            # OBSERVACIONES
            # ==================================================

            exp.observaciones = valor_excel(
                row,
                "OBSERVACIONES"
            )

            # ==================================================
            # CAMPOS DE FACTURACIÓN / REGISTRAL
            # ==================================================

            # Estos campos no vienen actualmente del Excel ABSIS,
            # por lo que no se modifican aquí.

            # ==================================================
            # PROCESADO
            # ==================================================

            procesados += 1

            # ==================================================
            # LOG CADA 100
            # ==================================================

            if procesados % 100 == 0:

                print(
                    f"PROGRESO: {procesados}/{total_filtrados} "
                    f"| creados={creados} "
                    f"| actualizados={actualizados} "
                    f"| errores={errores}",
                    flush=True
                )

            # ==================================================
            # COMMIT POR LOTES
            # ==================================================

            if procesados % BATCH_SIZE == 0:

                print(
                    f"IMPORTADOR: commit lote "
                    f"{procesados // BATCH_SIZE}...",
                    flush=True
                )

                db.commit()

        except Exception as e:

            errores += 1

            print(
                f"ERROR PROCESANDO IDEXPEDIENTE "
                f"{idexp}: {e}",
                flush=True
            )

            # Rollback de la transacción actual.
            db.rollback()

            # El objeto que falló puede quedar en un estado
            # inconsistente, pero el siguiente expediente
            # seguirá utilizando la sesión limpia.

            continue

    # ========================================================
    # 14) COMMIT FINAL
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
    # 15) RESULTADO FINAL
    # ========================================================

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - FINALIZADO", flush=True)
    print("============================================", flush=True)

    print(
        f"FECHA: {fecha_objetivo}",
        flush=True
    )

    print(
        f"FILAS ENCONTRADAS: {total_filtrados_inicial}",
        flush=True
    )

    print(
        f"EXPEDIENTES VÁLIDOS: {total_filtrados}",
        flush=True
    )

    print(
        f"PROCESADOS: {procesados}",
        flush=True
    )

    print(
        f"CREADOS: {creados}",
        flush=True
    )

    print(
        f"ACTUALIZADOS: {actualizados}",
        flush=True
    )

    print(
        f"ERRORES: {errores}",
        flush=True
    )

    print("============================================", flush=True)

    return {
        "creados": creados,
        "actualizados": actualizados,
        "errores": errores,
        "fecha_importada": fecha_objetivo.isoformat(),
        "total_filtrados": total_filtrados,
        "total_procesados": procesados
    }

