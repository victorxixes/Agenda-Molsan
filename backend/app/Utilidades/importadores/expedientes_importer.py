
import pandas as pd
import io
from datetime import date
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente


# ============================================================
# CONFIGURACIÓN
# ============================================================

BATCH_SIZE = 500


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def normalizar_columnas(df):
    """
    Normaliza los nombres de columnas del Excel.

    Ejemplos:
        ' FECHAALTA ' -> 'FECHAALTA'
        '\\ufeffFECHAALTA' -> 'FECHAALTA'
        'FechaAlta' -> 'FECHAALTA'
    """

    columnas = []

    for columna in df.columns:

        nombre = str(columna)

        # Eliminar BOM
        nombre = nombre.replace("\ufeff", "")

        # Eliminar espacios
        nombre = nombre.strip()

        # Pasar a mayúsculas
        nombre = nombre.upper()

        columnas.append(nombre)

    df.columns = columnas

    return df


def obtener_valor(row, *nombres):
    """
    Devuelve el primer valor válido encontrado entre
    varias posibles columnas.
    """

    for nombre in nombres:

        valor = row.get(nombre)

        if valor is None:
            continue

        if pd.isna(valor):
            continue

        if isinstance(valor, str) and not valor.strip():
            continue

        return valor

    return None


def limpiar_valor(valor):
    """
    Convierte NaN/NaT en None para evitar introducir
    valores inválidos en SQLAlchemy.
    """

    if valor is None:
        return None

    try:
        if pd.isna(valor):
            return None
    except Exception:
        pass

    return valor


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

    El Excel puede contener más de 100.000 filas.

    IMPORTANTE:
    - Se utiliza únicamente la primera hoja del Excel.
    - Se normalizan los nombres de las columnas.
    - FECHAALTA se interpreta como DD/MM/YYYY.
    - Se filtra inmediatamente por fecha_objetivo.
    - Solamente se procesan las filas de la fecha indicada.
    - No se generan ExpedienteDetalle.
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

    # ========================================================
    # 1) COMPROBAR CONTENIDO
    # ========================================================

    if not contenido_excel:
        raise ValueError(
            "El fichero Excel está vacío."
        )

    print(
        f"TAMAÑO DEL FICHERO: {len(contenido_excel)} bytes",
        flush=True
    )

    # ========================================================
    # 2) LEER PRIMERA HOJA DEL EXCEL
    # ========================================================

    print(
        "IMPORTADOR: leyendo primera hoja del Excel...",
        flush=True
    )

    try:

        df = pd.read_excel(
            io.BytesIO(contenido_excel),
            sheet_name=0
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
    # 3) NORMALIZAR COLUMNAS
    # ========================================================

    df = normalizar_columnas(df)

    print(
        f"COLUMNAS NORMALIZADAS: {list(df.columns)}",
        flush=True
    )

    # ========================================================
    # 4) COMPROBAR COLUMNAS OBLIGATORIAS
    # ========================================================

    if "FECHAALTA" not in df.columns:

        print(
            "ERROR: no se encuentra FECHAALTA.",
            flush=True
        )

        raise ValueError(
            "El Excel no contiene la columna FECHAALTA."
        )

    if "IDEXPEDIENTE" not in df.columns:

        print(
            "ERROR: no se encuentra IDEXPEDIENTE.",
            flush=True
        )

        raise ValueError(
            "El Excel no contiene la columna IDEXPEDIENTE."
        )

    print(
        "COLUMNAS OBLIGATORIAS ENCONTRADAS.",
        flush=True
    )

    # ========================================================
    # 5) CONVERTIR FECHAALTA
    # ========================================================

    print(
        "IMPORTADOR: convirtiendo FECHAALTA...",
        flush=True
    )

    try:

        df["FECHAALTA"] = pd.to_datetime(
            df["FECHAALTA"],
            dayfirst=True,
            errors="coerce"
        ).dt.date

    except Exception as e:

        print(
            f"ERROR CONVIRTIENDO FECHAALTA: {e}",
            flush=True
        )

        raise ValueError(
            "No se pudo convertir la columna FECHAALTA."
        )

    # ========================================================
    # 6) INFORMACIÓN SOBRE LAS FECHAS
    # ========================================================

    fechas_validas = df["FECHAALTA"].notna().sum()

    print(
        f"FECHAS FECHAALTA VÁLIDAS: {fechas_validas}",
        flush=True
    )

    print(
        f"FECHAS FECHAALTA INVÁLIDAS: "
        f"{len(df) - fechas_validas}",
        flush=True
    )

    # Mostrar algunas fechas para diagnóstico
    fechas_muestra = (
        df["FECHAALTA"]
        .dropna()
        .drop_duplicates()
        .head(10)
        .tolist()
    )

    print(
        f"MUESTRA DE FECHAS DETECTADAS: {fechas_muestra}",
        flush=True
    )

    # ========================================================
    # 7) FILTRAR POR FECHA
    # ========================================================

    print(
        "============================================",
        flush=True
    )

    print(
        f"FILTRANDO POR FECHA: {fecha_objetivo}",
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
    # 8) NO HAY DATOS
    # ========================================================

    if total_filtrados == 0:

        print(
            "IMPORTADOR: no se encontraron expedientes "
            "para la fecha indicada.",
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
    # 9) LIMPIAR IDEXPEDIENTE
    # ========================================================

    print(
        "IMPORTADOR: limpiando identificadores...",
        flush=True
    )

    df_filtrado["IDEXPEDIENTE"] = (
        df_filtrado["IDEXPEDIENTE"]
        .astype(str)
        .str.strip()
    )

    df_filtrado = df_filtrado[
        (df_filtrado["IDEXPEDIENTE"] != "") &
        (df_filtrado["IDEXPEDIENTE"].str.lower() != "nan")
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
    # 10) IDS ÚNICOS
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
    # 11) BUSCAR EXPEDIENTES EXISTENTES
    # ========================================================

    print(
        "IMPORTADOR: comprobando expedientes existentes...",
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
    # 13) PROCESAR
    # ========================================================

    print(
        "IMPORTADOR: comenzando procesamiento...",
        flush=True
    )

    for _, row in df_filtrado.iterrows():

        idexp = str(
            row.get("IDEXPEDIENTE")
        ).strip()

        try:

            # ==================================================
            # BUSCAR EXISTENTE
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

            exp.fecha_alta = limpiar_valor(
                row.get("FECHAALTA")
            )

            exp.fecha_firma = limpiar_valor(
                row.get("FECHAFIRMA")
            )

            exp.fecha_inscripcion = limpiar_valor(
                row.get("FECHAINSCRIPCION")
            )

            exp.fecha_entregado_cliente = limpiar_valor(
                row.get("FECHAENTREGADOCLIENTE")
            )

            exp.fecha_prevista_firma = limpiar_valor(
                row.get("FECHAPREVISTAFIRMA")
            )

            exp.fecha_vencimiento = limpiar_valor(
                row.get("FECHAVENCIMIENTO")
            )

            exp.fecha_sol_cgn = limpiar_valor(
                row.get("FECHASOLCGN")
            )

            exp.fecha_firma_prev_val = limpiar_valor(
                row.get("FECHAFIRMAPREVVAL")
            )

            exp.fecha_firma_prev_cli = limpiar_valor(
                row.get("FECHAFIRMAPREVCLI")
            )

            # ==================================================
            # ESTADOS
            # ==================================================

            exp.estado_expediente = limpiar_valor(
                obtener_valor(
                    row,
                    "ESTADOEXPEDIENTE",
                    "ESTADO_EXPEDIENTE"
                )
            )

            exp.estado_expediente_ancert = limpiar_valor(
                obtener_valor(
                    row,
                    "ESTADOEXPEDIENTEANCERT",
                    "ESTADO_EXPEDIENTE_ANCERT"
                )
            )

            # ==================================================
            # ACTIVIDAD
            # ==================================================

            exp.actividad_actual = limpiar_valor(
                obtener_valor(
                    row,
                    "ACTIVIDADACTUAL",
                    "ACTIVIDAD_ACTUAL"
                )
            )

            exp.estado_actividad = limpiar_valor(
                obtener_valor(
                    row,
                    "ESTADOACTIVIDAD",
                    "ESTADO_ACTIVIDAD"
                )
            )

            exp.fecha_inicio_actividad = limpiar_valor(
                row.get("FECHAINICIOACTIVIDAD")
            )

            exp.fecha_fin_actividad = limpiar_valor(
                row.get("FECHAFINACTIVIDAD")
            )

            # ==================================================
            # TITULAR
            # ==================================================

            exp.nombre_titular = limpiar_valor(
                obtener_valor(
                    row,
                    "NOMBRETITULAR",
                    "NOMBRE_TITULAR"
                )
            )

            exp.nif_titular = limpiar_valor(
                obtener_valor(
                    row,
                    "NIFTITULAR",
                    "NIF_TITULAR"
                )
            )

            # ==================================================
            # NOTARIO
            # ==================================================

            exp.nombre_notario = limpiar_valor(
                obtener_valor(
                    row,
                    "NOMBRENOTARIO",
                    "NOMBRE_NOTARIO"
                )
            )

            exp.nif_notario = limpiar_valor(
                obtener_valor(
                    row,
                    "NIFNOTARIO",
                    "NIF_NOTARIO"
                )
            )

            exp.notario = limpiar_valor(
                obtener_valor(
                    row,
                    "NOTARIO",
                    "NOMBRENOTARIO"
                )
            )

            # ==================================================
            # OFICINA
            # ==================================================

            exp.oficina = limpiar_valor(
                row.get("OFICINA")
            )

            exp.oficina_alta = limpiar_valor(
                row.get("OFICINAALTA")
            )

            exp.dan = limpiar_valor(
                row.get("DAN")
            )

            # ==================================================
            # ECONÓMICOS
            # ==================================================

            exp.capital = limpiar_valor(
                row.get("CAPITAL")
            )

            exp.importe = limpiar_valor(
                row.get("IMPORTE")
            )

            exp.saldo_real = limpiar_valor(
                row.get("SALDOREAL")
            )

            exp.saldo_disponible = limpiar_valor(
                row.get("SALDODISPONIBLE")
            )

            # ==================================================
            # OPERACIÓN
            # ==================================================

            exp.contrato = limpiar_valor(
                row.get("CONTRATO")
            )

            exp.num_solicitud_sia = limpiar_valor(
                obtener_valor(
                    row,
                    "NUMSOLICITUDSIA",
                    "NUM_SOLICITUD_SIA"
                )
            )

            exp.tipo_operacion = limpiar_valor(
                obtener_valor(
                    row,
                    "TIPOOPERACION",
                    "TIPO_OPERACION"
                )
            )

            exp.subtipo_operacion = limpiar_valor(
                obtener_valor(
                    row,
                    "SUBTIPOOPERACION",
                    "SUBTIPO_OPERACION"
                )
            )

            exp.vinccanc = limpiar_valor(
                row.get("VINCCANC")
            )

            exp.protocolo = limpiar_valor(
                row.get("PROTOCOLO")
            )

            # ==================================================
            # GTG / BANKIA
            # ==================================================

            exp.origen_bankia = limpiar_valor(
                row.get("ORIGENBANKIA")
            )

            exp.producto_gtg = limpiar_valor(
                obtener_valor(
                    row,
                    "PRODUCTOGTG",
                    "PRODUCTO_GTG"
                )
            )

            exp.dt = limpiar_valor(
                row.get("DT")
            )

            # ==================================================
            # GESTORÍA
            # ==================================================

            exp.gestoria = limpiar_valor(
                obtener_valor(
                    row,
                    "GESTORIA",
                    "NOMBREGESTORIA"
                )
            )

            # ==================================================
            # CGN
            # ==================================================

            exp.id_expediente_cgn = limpiar_valor(
                obtener_valor(
                    row,
                    "IDEXPEDIENTECGN",
                    "ID_EXPEDIENTE_CGN"
                )
            )

            # ==================================================
            # OTROS
            # ==================================================

            exp.lucy = limpiar_valor(
                row.get("LUCY")
            )

            exp.indicador_tt = limpiar_valor(
                row.get("INDICADORTT")
            )

            # ==================================================
            # OBSERVACIONES
            # ==================================================

            exp.observaciones = limpiar_valor(
                row.get("OBSERVACIONES")
            )

            # ==================================================
            # CONTADOR
            # ==================================================

            procesados += 1

            # ==================================================
            # PROGRESO
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
    # 15) RESULTADO
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
