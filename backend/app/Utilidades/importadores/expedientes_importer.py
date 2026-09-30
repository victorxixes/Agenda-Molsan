import io
from datetime import date, datetime

from openpyxl import load_workbook
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente


# ============================================================
# CONFIGURACIÓN
# ============================================================

BATCH_SIZE = 500


# ============================================================
# UTILIDADES
# ============================================================

def convertir_fecha(valor):
    """
    Convierte distintos formatos posibles de fecha a date.

    Admite, entre otros:

        08/11/2025
        08-11-2025
        2025-11-08
        datetime
        date

    Devuelve None si no puede convertir el valor.
    """

    if valor is None:
        return None

    if isinstance(valor, datetime):
        return valor.date()

    if isinstance(valor, date):
        return valor

    texto = str(valor).strip()

    if not texto:
        return None

    formatos = (
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%Y-%m-%d",
        "%Y/%m/%d",
        "%d/%m/%y",
        "%d-%m-%y",
    )

    for formato in formatos:
        try:
            return datetime.strptime(texto, formato).date()
        except ValueError:
            continue

    return None


def limpiar_valor(valor):
    """
    Convierte valores de Excel a valores adecuados
    para SQLAlchemy.

    Los NaN y cadenas vacías se convierten en None.
    """

    if valor is None:
        return None

    # Evitar problemas con valores especiales de pandas,
    # aunque en este importador ya no utilizamos pandas.
    try:
        if hasattr(valor, "item"):
            valor = valor.item()
    except Exception:
        pass

    if isinstance(valor, str):
        valor = valor.strip()

        if valor == "":
            return None

    return valor


def obtener_valor(row_dict, *nombres):
    """
    Obtiene el primer valor existente de una fila.

    Permite soportar nombres como:

        TIPOOPERACION
        TIPO_OPERACION
    """

    for nombre in nombres:
        if nombre in row_dict:
            valor = limpiar_valor(row_dict[nombre])

            if valor is not None:
                return valor

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

    - El Excel puede tener más de 100.000 filas.
    - No se utiliza pandas para cargar todo el fichero.
    - El XLSX se abre en modo read_only.
    - Primero se localiza la hoja correcta.
    - Después se identifican las columnas FECHAALTA e
      IDEXPEDIENTE.
    - Solo se procesan las filas cuya FECHAALTA coincide
      con fecha_objetivo.

    Esto reduce considerablemente el consumo de memoria.
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
    # 1) ABRIR EXCEL EN MODO READ_ONLY
    # ========================================================

    print(
        "IMPORTADOR: abriendo Excel en modo lectura...",
        flush=True
    )

    try:
        wb = load_workbook(
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
            "No se pudo abrir el archivo Excel. "
            "El fichero puede estar corrupto o no ser un XLSX válido."
        )

    print(
        f"HOJAS EN EL EXCEL: {wb.sheetnames}",
        flush=True
    )

    # ========================================================
    # 2) LOCALIZAR LA HOJA CORRECTA
    # ========================================================

    hoja_encontrada = None
    encabezados_encontrados = None

    print(
        "IMPORTADOR: buscando hoja con IDEXPEDIENTE y FECHAALTA...",
        flush=True
    )

    try:

        for ws in wb.worksheets:

            print(
                f"COMPROBANDO HOJA: {ws.title}",
                flush=True
            )

            # ------------------------------------------------
            # Leer solamente la primera fila
            # ------------------------------------------------

            primera_fila = next(
                ws.iter_rows(
                    min_row=1,
                    max_row=1,
                    values_only=True
                ),
                None
            )

            if not primera_fila:
                print(
                    f"HOJA {ws.title}: vacía.",
                    flush=True
                )
                continue

            encabezados = []

            for valor in primera_fila:

                if valor is None:
                    encabezados.append("")
                else:
                    encabezados.append(
                        str(valor).strip().upper()
                    )

            print(
                f"ENCABEZADOS HOJA {ws.title}: "
                f"{encabezados[:10]}...",
                flush=True
            )

            # ------------------------------------------------
            # Buscar columnas obligatorias
            # ------------------------------------------------

            if (
                "IDEXPEDIENTE" in encabezados
                and "FECHAALTA" in encabezados
            ):

                hoja_encontrada = ws
                encabezados_encontrados = encabezados

                print(
                    f"HOJA ENCONTRADA: {ws.title}",
                    flush=True
                )

                print(
                    f"TOTAL COLUMNAS DETECTADAS: "
                    f"{len(encabezados)}",
                    flush=True
                )

                break

    except Exception as e:

        wb.close()

        print(
            f"ERROR BUSCANDO HOJA: {e}",
            flush=True
        )

        raise ValueError(
            f"Error leyendo la estructura del Excel: {e}"
        )

    # ========================================================
    # 3) COMPROBAR QUE SE ENCONTRÓ LA HOJA
    # ========================================================

    if hoja_encontrada is None:

        wb.close()

        print(
            "ERROR: no se encontró una hoja con "
            "IDEXPEDIENTE y FECHAALTA.",
            flush=True
        )

        raise ValueError(
            "No se ha encontrado ninguna hoja que contenga "
            "las columnas FECHAALTA e IDEXPEDIENTE."
        )

    ws = hoja_encontrada
    encabezados = encabezados_encontrados

    # ========================================================
    # 4) POSICIONES DE LAS COLUMNAS
    # ========================================================

    try:

        indice_id = encabezados.index(
            "IDEXPEDIENTE"
        )

        indice_fecha = encabezados.index(
            "FECHAALTA"
        )

    except ValueError:

        wb.close()

        raise ValueError(
            "No se pudieron localizar las columnas "
            "IDEXPEDIENTE y FECHAALTA."
        )

    print(
        f"COLUMNA IDEXPEDIENTE: {indice_id}",
        flush=True
    )

    print(
        f"COLUMNA FECHAALTA: {indice_fecha}",
        flush=True
    )

    # ========================================================
    # 5) CONTADORES
    # ========================================================

    filas_leidas = 0
    filas_fecha = 0
    filas_validas = 0

    errores = 0
    creados = 0
    actualizados = 0
    procesados = 0

    # ========================================================
    # 6) RECORRER EXCEL
    # ========================================================

    print(
        "IMPORTADOR: buscando filas de la fecha objetivo...",
        flush=True
    )

    ids_encontrados = []
    filas_encontradas = []

    try:

        for fila in ws.iter_rows(
            min_row=2,
            values_only=True
        ):

            filas_leidas += 1

            # ------------------------------------------------
            # Log cada 10.000 filas
            # ------------------------------------------------

            if filas_leidas % 10000 == 0:

                print(
                    f"LECTURA EXCEL: {filas_leidas} filas "
                    f"revisadas...",
                    flush=True
                )

            # ------------------------------------------------
            # Seguridad por si la fila es más corta
            # ------------------------------------------------

            if indice_fecha >= len(fila):
                continue

            if indice_id >= len(fila):
                continue

            valor_fecha = fila[indice_fecha]

            fecha_fila = convertir_fecha(
                valor_fecha
            )

            # ------------------------------------------------
            # Comparar fecha
            # ------------------------------------------------

            if fecha_fila != fecha_objetivo:
                continue

            filas_fecha += 1

            valor_id = fila[indice_id]

            if valor_id is None:
                continue

            idexp = str(valor_id).strip()

            if not idexp:
                continue

            filas_validas += 1

            # ------------------------------------------------
            # Convertir la fila a diccionario
            # ------------------------------------------------

            row_dict = {}

            for posicion, nombre_columna in enumerate(
                encabezados
            ):

                if posicion < len(fila):

                    row_dict[nombre_columna] = (
                        fila[posicion]
                    )

                else:

                    row_dict[nombre_columna] = None

            ids_encontrados.append(idexp)

            filas_encontradas.append(
                row_dict
            )

        print(
            f"FILAS EXCEL LEÍDAS: {filas_leidas}",
            flush=True
        )

        print(
            f"FILAS CON FECHA {fecha_objetivo}: "
            f"{filas_fecha}",
            flush=True
        )

        print(
            f"FILAS CON IDEXPEDIENTE VÁLIDO: "
            f"{filas_validas}",
            flush=True
        )

    finally:

        wb.close()

    # ========================================================
    # 7) SI NO HAY DATOS
    # ========================================================

    if not filas_encontradas:

        print(
            "IMPORTADOR: no se encontraron expedientes "
            "para la fecha indicada.",
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
    # 8) ELIMINAR DUPLICADOS
    # ========================================================

    ids_unicos = list(
        dict.fromkeys(ids_encontrados)
    )

    print(
        f"IDEXPEDIENTE ÚNICOS ENCONTRADOS: "
        f"{len(ids_unicos)}",
        flush=True
    )

    # ========================================================
    # 9) BUSCAR EXPEDIENTES EXISTENTES
    # ========================================================

    print(
        "IMPORTADOR: comprobando expedientes "
        "existentes en BD...",
        flush=True
    )

    existentes_por_id = {}

    # --------------------------------------------------------
    # Dividir IDs en bloques para evitar una consulta IN
    # gigantesca.
    # --------------------------------------------------------

    for inicio in range(
        0,
        len(ids_unicos),
        BATCH_SIZE
    ):

        bloque_ids = ids_unicos[
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
                exp.id_expediente
            ] = exp

    print(
        f"EXPEDIENTES YA EXISTENTES: "
        f"{len(existentes_por_id)}",
        flush=True
    )

    # ========================================================
    # 10) PROCESAR EXPEDIENTES
    # ========================================================

    print(
        "IMPORTADOR: comenzando importación...",
        flush=True
    )

    for row_dict in filas_encontradas:

        idexp = str(
            row_dict["IDEXPEDIENTE"]
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

            exp.fecha_alta = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAALTA"
                )
            )

            exp.fecha_firma = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAFIRMA"
                )
            )

            exp.fecha_inscripcion = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAINSCRIPCION"
                )
            )

            exp.fecha_entregado_cliente = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAENTREGADOCLIENTE"
                )
            )

            exp.fecha_prevista_firma = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAPREVISTAFIRMA"
                )
            )

            exp.fecha_vencimiento = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAVENCIMIENTO"
                )
            )

            exp.fecha_sol_cgn = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHASOLCGN"
                )
            )

            exp.fecha_firma_prev_val = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAFIRMAPREVVAL"
                )
            )

            exp.fecha_firma_prev_cli = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAFIRMAPREVCLI"
                )
            )

            # ==================================================
            # ESTADOS
            # ==================================================

            exp.estado_expediente = obtener_valor(
                row_dict,
                "ESTADOEXPEDIENTE",
                "ESTADO_EXPEDIENTE"
            )

            exp.estado_expediente_ancert = obtener_valor(
                row_dict,
                "ESTADOEXPEDIENTEANCERT",
                "ESTADO_EXPEDIENTE_ANCERT"
            )

            # ==================================================
            # ACTIVIDAD
            # ==================================================

            exp.actividad_actual = obtener_valor(
                row_dict,
                "ACTIVIDADACTUAL",
                "ACTIVIDAD_ACTUAL"
            )

            exp.estado_actividad = obtener_valor(
                row_dict,
                "ESTADOACTIVIDAD",
                "ESTADO_ACTIVIDAD"
            )

            exp.fecha_inicio_actividad = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAINICIOACTIVIDAD"
                )
            )

            exp.fecha_fin_actividad = convertir_fecha(
                obtener_valor(
                    row_dict,
                    "FECHAFINACTIVIDAD"
                )
            )

            # ==================================================
            # TITULAR
            # ==================================================

            exp.nombre_titular = obtener_valor(
                row_dict,
                "NOMBRETITULAR",
                "NOMBRE_TITULAR"
            )

            exp.nif_titular = obtener_valor(
                row_dict,
                "NIFTITULAR",
                "NIF_TITULAR"
            )

            # ==================================================
            # NOTARIO
            # ==================================================

            exp.nombre_notario = obtener_valor(
                row_dict,
                "NOMBRENOTARIO",
                "NOMBRE_NOTARIO"
            )

            exp.nif_notario = obtener_valor(
                row_dict,
                "NIFNOTARIO",
                "NIF_NOTARIO"
            )

            exp.notario = obtener_valor(
                row_dict,
                "NOTARIO",
                "NOMBRENOTARIO"
            )

            # ==================================================
            # OFICINA
            # ==================================================

            exp.oficina = obtener_valor(
                row_dict,
                "OFICINA"
            )

            exp.oficina_alta = obtener_valor(
                row_dict,
                "OFICINAALTA"
            )

            exp.dan = obtener_valor(
                row_dict,
                "DAN"
            )

            # ==================================================
            # ECONÓMICOS
            # ==================================================

            exp.capital = obtener_valor(
                row_dict,
                "CAPITAL"
            )

            exp.importe = obtener_valor(
                row_dict,
                "IMPORTE"
            )

            exp.saldo_real = obtener_valor(
                row_dict,
                "SALDOREAL"
            )

            exp.saldo_disponible = obtener_valor(
                row_dict,
                "SALDODISPONIBLE"
            )

            # ==================================================
            # OPERACIÓN
            # ==================================================

            exp.contrato = obtener_valor(
                row_dict,
                "CONTRATO"
            )

            exp.num_solicitud_sia = obtener_valor(
                row_dict,
                "NUMSOLICITUDSIA",
                "NUM_SOLICITUD_SIA"
            )

            exp.tipo_operacion = obtener_valor(
                row_dict,
                "TIPOOPERACION",
                "TIPO_OPERACION"
            )

            exp.subtipo_operacion = obtener_valor(
                row_dict,
                "SUBTIPOOPERACION",
                "SUBTIPO_OPERACION"
            )

            exp.vinccanc = obtener_valor(
                row_dict,
                "VINCCANC"
            )

            exp.protocolo = obtener_valor(
                row_dict,
                "PROTOCOLO"
            )

            # ==================================================
            # GTG / BANKIA
            # ==================================================

            exp.origen_bankia = obtener_valor(
                row_dict,
                "ORIGENBANKIA"
            )

            exp.producto_gtg = obtener_valor(
                row_dict,
                "PRODUCTOGTG",
                "PRODUCTO_GTG"
            )

            exp.dt = obtener_valor(
                row_dict,
                "DT"
            )

            # ==================================================
            # GESTORÍA
            # ==================================================

            exp.gestoria = obtener_valor(
                row_dict,
                "GESTORIA",
                "NOMBREGESTORIA"
            )

            # ==================================================
            # CGN
            # ==================================================

            exp.id_expediente_cgn = obtener_valor(
                row_dict,
                "IDEXPEDIENTECGN",
                "ID_EXPEDIENTE_CGN"
            )

            # ==================================================
            # OTROS
            # ==================================================

            exp.lucy = obtener_valor(
                row_dict,
                "LUCY"
            )

            exp.indicador_tt = obtener_valor(
                row_dict,
                "INDICADORTT"
            )

            # ==================================================
            # OBSERVACIONES
            # ==================================================

            exp.observaciones = obtener_valor(
                row_dict,
                "OBSERVACIONES"
            )

            procesados += 1

            # ==================================================
            # LOG DE PROGRESO
            # ==================================================

            if procesados % 25 == 0:

                print(
                    f"PROGRESO IMPORTACIÓN: "
                    f"{procesados}/{len(filas_encontradas)} "
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
                    f"{procesados // BATCH_SIZE}",
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

            # Después de rollback, eliminamos el objeto
            # de memoria para evitar estados inconsistentes.
            existentes_por_id.pop(
                idexp,
                None
            )

    # ========================================================
    # 11) COMMIT FINAL
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
    # 12) RESULTADO
    # ========================================================

    print(
        "============================================",
        flush=True
    )

    print(
        "IMPORTADOR ABSIS - FINALIZADO",
        flush=True
    )

    print(
        f"FECHA: {fecha_objetivo}",
        flush=True
    )

    print(
        f"FILAS EXCEL LEÍDAS: {filas_leidas}",
        flush=True
    )

    print(
        f"FILAS FECHA OBJETIVO: {filas_fecha}",
        flush=True
    )

    print(
        f"FILAS VÁLIDAS: {filas_validas}",
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

    print(
        "============================================",
        flush=True
    )

    return {
        "creados": creados,
        "actualizados": actualizados,
        "errores": errores,
        "fecha_importada": fecha_objetivo.isoformat(),
        "total_filtrados": filas_validas,
        "total_procesados": procesados
    }

