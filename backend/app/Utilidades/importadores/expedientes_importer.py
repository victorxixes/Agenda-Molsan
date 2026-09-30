import io
from datetime import date, datetime

import openpyxl
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente


# ============================================================
# CONFIGURACIÓN
# ============================================================

BATCH_SIZE = 500


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def normalizar_nombre_columna(valor):
    """
    Normaliza el nombre de una columna del Excel.
    """

    if valor is None:
        return ""

    return (
        str(valor)
        .strip()
        .upper()
        .replace(" ", "")
        .replace("_", "")
    )


def convertir_fecha(valor):
    """
    Convierte una celda Excel a datetime.date.

    Admite:
    - datetime
    - date
    - DD/MM/YYYY
    - DD-MM-YYYY
    - YYYY-MM-DD
    - YYYY/MM/DD
    """

    if valor is None:
        return None

    if isinstance(valor, datetime):
        return valor.date()

    if isinstance(valor, date):
        return valor

    if isinstance(valor, str):

        valor = valor.strip()

        if not valor:
            return None

        formatos = [
            "%d/%m/%Y",
            "%d-%m-%Y",
            "%Y-%m-%d",
            "%Y/%m/%d",
            "%d/%m/%y",
            "%d-%m-%y",
        ]

        for formato in formatos:

            try:
                return datetime.strptime(
                    valor,
                    formato
                ).date()

            except ValueError:
                continue

    return None


def obtener_valor(
    row,
    columnas,
    nombre,
    alternativas=None
):
    """
    Obtiene un valor de una fila utilizando el nombre
    normalizado de la columna.
    """

    if alternativas is None:
        alternativas = []

    nombres = [nombre] + alternativas

    for nombre_columna in nombres:

        nombre_normalizado = normalizar_nombre_columna(
            nombre_columna
        )

        indice = columnas.get(nombre_normalizado)

        if indice is not None:

            try:
                return row[indice]
            except IndexError:
                return None

    return None


# ============================================================
# IMPORTADOR
# ============================================================

def importar_excel_expedientes(
    db: Session,
    contenido_excel: bytes,
    fecha_objetivo: date = None
):
    """
    Importa expedientes desde el Excel matriz ABSIS.

    El Excel puede contener más de 100.000 filas.

    El fichero se abre mediante openpyxl en modo READ_ONLY.

    NO se carga el Excel completo en pandas.

    El importador:

    1. Busca automáticamente la hoja que contiene
       FECHAALTA e IDEXPEDIENTE.

    2. Lee las filas una a una.

    3. Comprueba FECHAALTA ANTES de procesar el resto
       de información.

    4. Solamente importa las filas correspondientes
       a fecha_objetivo.

    5. Hace commit por lotes.
    """

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - INICIO", flush=True)
    print("============================================", flush=True)

    # ========================================================
    # 0) FECHA
    # ========================================================

    if fecha_objetivo is None:
        fecha_objetivo = date.today()

    print(
        f"FECHA OBJETIVO: {fecha_objetivo}",
        flush=True
    )

    # ========================================================
    # 1) VALIDAR FICHERO
    # ========================================================

    if not contenido_excel:

        raise ValueError(
            "El fichero Excel está vacío."
        )

    print(
        f"TAMAÑO FICHERO: "
        f"{len(contenido_excel)} bytes",
        flush=True
    )

    # ========================================================
    # 2) ABRIR EXCEL READ_ONLY
    # ========================================================

    print(
        "IMPORTADOR: abriendo Excel en modo READ_ONLY...",
        flush=True
    )

    try:

        wb = openpyxl.load_workbook(
            filename=io.BytesIO(contenido_excel),
            read_only=True,
            data_only=True
        )

    except Exception as e:

        print(
            f"ERROR ABRIENDO EXCEL: {e}",
            flush=True
        )

        raise ValueError(
            "No se pudo abrir el archivo Excel."
        )

    try:

        # ====================================================
        # 3) BUSCAR LA HOJA CORRECTA
        # ====================================================

        print(
            "IMPORTADOR: buscando hoja de expedientes...",
            flush=True
        )

        print(
            f"HOJAS DISPONIBLES: {wb.sheetnames}",
            flush=True
        )

        hoja_correcta = None
        columnas = None

        for nombre_hoja in wb.sheetnames:

            print(
                f"COMPROBANDO HOJA: {nombre_hoja}",
                flush=True
            )

            ws_temp = wb[nombre_hoja]

            filas_temp = ws_temp.iter_rows(
                min_row=1,
                max_row=1,
                values_only=True
            )

            try:
                cabecera_temp = next(filas_temp)
            except StopIteration:
                continue

            columnas_temp = {}

            for indice, nombre_columna in enumerate(
                cabecera_temp
            ):

                nombre_normalizado = (
                    normalizar_nombre_columna(
                        nombre_columna
                    )
                )

                if nombre_normalizado:

                    columnas_temp[
                        nombre_normalizado
                    ] = indice

            print(
                f"  COLUMNAS DETECTADAS: "
                f"{len(columnas_temp)}",
                flush=True
            )

            tiene_fecha = (
                "FECHAALTA" in columnas_temp
            )

            tiene_id = (
                "IDEXPEDIENTE" in columnas_temp
            )

            print(
                f"  FECHAALTA: {tiene_fecha}",
                flush=True
            )

            print(
                f"  IDEXPEDIENTE: {tiene_id}",
                flush=True
            )

            if tiene_fecha and tiene_id:

                hoja_correcta = ws_temp
                columnas = columnas_temp

                print(
                    f"HOJA ENCONTRADA: {nombre_hoja}",
                    flush=True
                )

                break

        # ====================================================
        # 4) SI NO SE ENCUENTRA LA HOJA
        # ====================================================

        if hoja_correcta is None:

            raise ValueError(
                "No se ha encontrado ninguna hoja que "
                "contenga las columnas FECHAALTA e "
                "IDEXPEDIENTE."
            )

        ws = hoja_correcta

        print(
            f"HOJA UTILIZADA: {ws.title}",
            flush=True
        )

        print(
            f"TOTAL FILAS REPORTADAS: {ws.max_row}",
            flush=True
        )

        print(
            f"TOTAL COLUMNAS REPORTADAS: "
            f"{ws.max_column}",
            flush=True
        )

        # ====================================================
        # 5) LOG DE COLUMNAS
        # ====================================================

        print(
            f"COLUMNAS NORMALIZADAS: "
            f"{list(columnas.keys())}",
            flush=True
        )

        indice_fecha_alta = columnas["FECHAALTA"]
        indice_id_expediente = columnas["IDEXPEDIENTE"]

        print(
            f"ÍNDICE FECHAALTA: "
            f"{indice_fecha_alta}",
            flush=True
        )

        print(
            f"ÍNDICE IDEXPEDIENTE: "
            f"{indice_id_expediente}",
            flush=True
        )

        # ====================================================
        # 6) ITERAR FILAS
        # ====================================================

        filas = ws.iter_rows(
            min_row=2,
            values_only=True
        )

        filas_leidas = 0
        filas_fecha_coincidente = 0
        filas_fecha_no_coincidente = 0
        filas_sin_fecha = 0
        filas_sin_id = 0

        creados = 0
        actualizados = 0
        errores = 0
        procesados = 0

        # ====================================================
        # CACHE
        # ====================================================

        existentes_por_id = {}

        print(
            "============================================",
            flush=True
        )

        print(
            "IMPORTADOR: comenzando lectura fila a fila",
            flush=True
        )

        print(
            "IMPORTADOR: FILTRO FECHAALTA ACTIVADO",
            flush=True
        )

        print(
            "============================================",
            flush=True
        )

        # ====================================================
        # 7) PROCESAMIENTO
        # ====================================================

        for row in filas:

            filas_leidas += 1

            # ------------------------------------------------
            # FECHAALTA
            # ------------------------------------------------

            try:

                valor_fecha = row[indice_fecha_alta]

            except IndexError:

                filas_sin_fecha += 1
                continue

            fecha_fila = convertir_fecha(
                valor_fecha
            )

            if fecha_fila is None:

                filas_sin_fecha += 1
                continue

            # ------------------------------------------------
            # FILTRO PRINCIPAL
            # ------------------------------------------------

            if fecha_fila != fecha_objetivo:

                filas_fecha_no_coincidente += 1

                if filas_leidas % 20000 == 0:

                    print(
                        f"LECTURA: {filas_leidas} filas | "
                        f"coincidentes="
                        f"{filas_fecha_coincidente} | "
                        f"descartadas="
                        f"{filas_fecha_no_coincidente}",
                        flush=True
                    )

                continue

            # =================================================
            # FECHA COINCIDE
            # =================================================

            filas_fecha_coincidente += 1

            print(
                f"FECHA ENCONTRADA: fila={filas_leidas} "
                f"| fecha={fecha_fila}",
                flush=True
            )

            # ------------------------------------------------
            # ID EXPEDIENTE
            # ------------------------------------------------

            try:

                valor_id = row[indice_id_expediente]

            except IndexError:

                filas_sin_id += 1
                continue

            if valor_id is None:

                filas_sin_id += 1
                continue

            idexp = str(valor_id).strip()

            if not idexp or idexp.lower() == "nan":

                filas_sin_id += 1
                continue

            # =================================================
            # BUSCAR EXPEDIENTE
            # =================================================

            try:

                exp = existentes_por_id.get(
                    idexp
                )

                if exp is None:

                    exp = (
                        db.query(Expediente)
                        .filter(
                            Expediente.id_expediente
                            == idexp
                        )
                        .first()
                    )

                    if exp is not None:

                        existentes_por_id[idexp] = exp

                # =============================================
                # CREAR
                # =============================================

                if exp is None:

                    exp = Expediente(
                        id_expediente=idexp
                    )

                    db.add(exp)

                    existentes_por_id[idexp] = exp

                    creados += 1

                    accion = "CREADO"

                # =============================================
                # ACTUALIZAR
                # =============================================

                else:

                    actualizados += 1

                    accion = "ACTUALIZADO"

                # =================================================
                # FECHAS
                # =================================================

                exp.fecha_alta = fecha_fila

                exp.fecha_firma = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHAFIRMA"
                    )
                )

                exp.fecha_inscripcion = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHAINSCRIPCION"
                    )
                )

                exp.fecha_entregado_cliente = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHAENTREGADOCLIENTE"
                    )
                )

                exp.fecha_prevista_firma = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHAPREVISTAFIRMA"
                    )
                )

                exp.fecha_vencimiento = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHAVENCIMIENTO"
                    )
                )

                exp.fecha_sol_cgn = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHASOLCGN"
                    )
                )

                exp.fecha_firma_prev_val = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHAFIRMAPREVVAL"
                    )
                )

                exp.fecha_firma_prev_cli = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHAFIRMAPREVCLI"
                    )
                )

                # =================================================
                # ESTADOS
                # =================================================

                exp.estado_expediente = obtener_valor(
                    row,
                    columnas,
                    "ESTADOEXPEDIENTE"
                )

                exp.estado_expediente_ancert = obtener_valor(
                    row,
                    columnas,
                    "ESTADOEXPEDIENTEANCERT"
                )

                # =================================================
                # ACTIVIDAD
                # =================================================

                exp.actividad_actual = obtener_valor(
                    row,
                    columnas,
                    "ACTIVIDADACTUAL"
                )

                exp.estado_actividad = obtener_valor(
                    row,
                    columnas,
                    "ESTADOACTIVIDAD"
                )

                exp.fecha_inicio_actividad = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHAINICIOACTIVIDAD"
                    )
                )

                exp.fecha_fin_actividad = convertir_fecha(
                    obtener_valor(
                        row,
                        columnas,
                        "FECHAFINACTIVIDAD"
                    )
                )

                # =================================================
                # TITULAR
                # =================================================

                exp.nombre_titular = obtener_valor(
                    row,
                    columnas,
                    "NOMBRETITULAR"
                )

                exp.nif_titular = obtener_valor(
                    row,
                    columnas,
                    "NIFTITULAR"
                )

                # =================================================
                # NOTARIO
                # =================================================

                exp.nombre_notario = obtener_valor(
                    row,
                    columnas,
                    "NOMBRENOTARIO"
                )

                exp.nif_notario = obtener_valor(
                    row,
                    columnas,
                    "NIFNOTARIO"
                )

                exp.notario = obtener_valor(
                    row,
                    columnas,
                    "NOTARIO"
                )

                # =================================================
                # OFICINA
                # =================================================

                exp.oficina = obtener_valor(
                    row,
                    columnas,
                    "OFICINA"
                )

                exp.oficina_alta = obtener_valor(
                    row,
                    columnas,
                    "OFICINAALTA"
                )

                exp.dan = obtener_valor(
                    row,
                    columnas,
                    "DAN"
                )

                # =================================================
                # ECONÓMICOS
                # =================================================

                exp.capital = obtener_valor(
                    row,
                    columnas,
                    "CAPITAL"
                )

                exp.importe = obtener_valor(
                    row,
                    columnas,
                    "IMPORTE"
                )

                exp.saldo_real = obtener_valor(
                    row,
                    columnas,
                    "SALDOREAL"
                )

                exp.saldo_disponible = obtener_valor(
                    row,
                    columnas,
                    "SALDODISPONIBLE"
                )

                # =================================================
                # OPERACIÓN
                # =================================================

                exp.contrato = obtener_valor(
                    row,
                    columnas,
                    "CONTRATO"
                )

                exp.num_solicitud_sia = obtener_valor(
                    row,
                    columnas,
                    "NUMSOLICITUDSIA"
                )

                exp.tipo_operacion = obtener_valor(
                    row,
                    columnas,
                    "TIPOOPERACION"
                )

                exp.subtipo_operacion = obtener_valor(
                    row,
                    columnas,
                    "SUBTIPOOPERACION"
                )

                exp.vinccanc = obtener_valor(
                    row,
                    columnas,
                    "VINCCANC"
                )

                exp.protocolo = obtener_valor(
                    row,
                    columnas,
                    "PROTOCOLO"
                )

                # =================================================
                # GTG / BANKIA
                # =================================================

                exp.origen_bankia = obtener_valor(
                    row,
                    columnas,
                    "ORIGENBANKIA"
                )

                exp.producto_gtg = obtener_valor(
                    row,
                    columnas,
                    "PRODUCTOGTG"
                )

                exp.dt = obtener_valor(
                    row,
                    columnas,
                    "DT"
                )

                # =================================================
                # GESTORÍA
                # =================================================

                exp.gestoria = obtener_valor(
                    row,
                    columnas,
                    "NOMBREGESTORIA"
                )

                # =================================================
                # CGN
                # =================================================

                exp.id_expediente_cgn = obtener_valor(
                    row,
                    columnas,
                    "IDEXPEDIENTECGN"
                )

                # =================================================
                # OTROS
                # =================================================

                exp.lucy = obtener_valor(
                    row,
                    columnas,
                    "LUCY"
                )

                exp.indicador_tt = obtener_valor(
                    row,
                    columnas,
                    "INDICADORTT"
                )

                # =================================================
                # OBSERVACIONES
                # =================================================

                exp.observaciones = obtener_valor(
                    row,
                    columnas,
                    "OBSERVACIONES"
                )

                procesados += 1

                print(
                    f"EXPEDIENTE {procesados} | "
                    f"{accion} | "
                    f"ID={idexp}",
                    flush=True
                )

                # =================================================
                # COMMIT POR LOTES
                # =================================================

                if procesados % BATCH_SIZE == 0:

                    print(
                        f"IMPORTADOR: guardando lote "
                        f"{procesados // BATCH_SIZE}...",
                        flush=True
                    )

                    db.commit()

                    print(
                        "IMPORTADOR: lote guardado.",
                        flush=True
                    )

            except Exception as e:

                errores += 1

                print(
                    f"ERROR PROCESANDO "
                    f"ID={idexp}: {e}",
                    flush=True
                )

                try:

                    db.rollback()

                    # Después de rollback limpiamos la cache
                    # porque los objetos SQLAlchemy pueden haber
                    # quedado expirados.

                    existentes_por_id = {}

                except Exception as rollback_error:

                    print(
                        f"ERROR EN ROLLBACK: "
                        f"{rollback_error}",
                        flush=True
                    )

        # ========================================================
        # 8) COMMIT FINAL
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
        # 9) RESULTADO
        # ========================================================

        print("============================================", flush=True)
        print("IMPORTADOR ABSIS - FINALIZADO", flush=True)
        print("============================================", flush=True)

        print(
            f"FECHA OBJETIVO: {fecha_objetivo}",
            flush=True
        )

        print(
            f"FILAS LEÍDAS: {filas_leidas}",
            flush=True
        )

        print(
            f"FILAS FECHA COINCIDENTE: "
            f"{filas_fecha_coincidente}",
            flush=True
        )

        print(
            f"FILAS DESCARTADAS POR FECHA: "
            f"{filas_fecha_no_coincidente}",
            flush=True
        )

        print(
            f"FILAS SIN FECHA: {filas_sin_fecha}",
            flush=True
        )

        print(
            f"FILAS SIN ID: {filas_sin_id}",
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
            "total_filtrados": filas_fecha_coincidente,
            "total_procesados": procesados,
            "filas_leidas": filas_leidas,
            "filas_descartadas_fecha": filas_fecha_no_coincidente,
            "filas_sin_fecha": filas_sin_fecha,
            "filas_sin_id": filas_sin_id
        }

    finally:

        try:

            wb.close()

            print(
                "IMPORTADOR: Excel cerrado correctamente.",
                flush=True
            )

        except Exception as e:

            print(
                f"ERROR CERRANDO EXCEL: {e}",
                flush=True
            )

