import io
from datetime import date, datetime
from typing import Any

import openpyxl
import pandas as pd
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente


# ============================================================
# CONFIGURACIÓN
# ============================================================

# Número de expedientes que se procesan antes de hacer commit.
BATCH_SIZE = 500


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def limpiar_valor(valor: Any):
    """
    Convierte valores de Excel/pandas a valores Python normales.

    Evita guardar:
    - None
    - NaN
    - NaT
    - textos vacíos
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
    Convierte cualquier valor a texto limpio.
    """

    valor = limpiar_valor(valor)

    if valor is None:
        return None

    texto = str(valor).strip()

    if not texto:
        return None

    return texto


def convertir_fecha(valor):
    """
    Convierte cualquier valor procedente del Excel a date.

    Acepta, entre otros:

    - datetime
    - date
    - pandas.Timestamp
    - 08/11/2025
    - 08/11/2025 00:00:00
    - 2025-11-08
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

    Gestiona:

    - números
    - strings vacíos
    - decimales con coma
    - valores tipo 1.234,56
    """

    valor = limpiar_valor(valor)

    if valor is None:
        return None

    if isinstance(valor, str):

        valor = valor.strip()

        if not valor:
            return None

        # ----------------------------------------------------
        # Formato europeo:
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

            valor = valor.replace(" ", "")

    try:

        return float(valor)

    except (TypeError, ValueError):

        return None


def obtener_valor(row, *columnas):
    """
    Devuelve el primer valor válido encontrado entre las
    columnas indicadas.

    row puede ser un diccionario o un objeto equivalente
    que permita acceder mediante [].
    """

    for columna in columnas:

        if columna not in row:
            continue

        valor = limpiar_valor(
            row[columna]
        )

        if valor is None:
            continue

        if isinstance(valor, str):

            valor = valor.strip()

            if not valor:
                continue

        return valor

    return None


def fecha_coincide(valor, fecha_objetivo: date) -> bool:
    """
    Comprueba si un valor de FECHAALTA corresponde exactamente
    con la fecha objetivo.

    No depende de la hora almacenada en Excel.
    """

    fecha = convertir_fecha(valor)

    if fecha is None:
        return False

    return fecha == fecha_objetivo


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

    Esta versión NO utiliza pandas.read_excel() para cargar
    todo el Excel en memoria.

    El XLSX se abre con openpyxl en modo read_only=True.

    El proceso es:

        1. Abrir el Excel en modo lectura.
        2. Leer únicamente la cabecera.
        3. Localizar FECHAALTA e IDEXPEDIENTE.
        4. Recorrer las filas una a una.
        5. Comprobar FECHAALTA.
        6. Ignorar las filas de otras fechas.
        7. Procesar únicamente los expedientes de la fecha.
        8. Crear o actualizar Expediente.
        9. Hacer commit por lotes.

    NO se crean ExpedienteDetalle.
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
        flush=True,
    )

    print(
        f"TAMAÑO DEL FICHERO: "
        f"{len(contenido_excel)} bytes",
        flush=True,
    )

    # ========================================================
    # 1) ABRIR EXCEL EN MODO READ ONLY
    # ========================================================

    print(
        "IMPORTADOR: abriendo Excel en modo lectura eficiente...",
        flush=True,
    )

    try:

        wb = openpyxl.load_workbook(
            filename=io.BytesIO(contenido_excel),
            read_only=True,
            data_only=True,
        )

    except Exception as e:

        print(
            f"ERROR ABRIENDO EXCEL: {e}",
            flush=True,
        )

        raise ValueError(
            f"No se pudo abrir el Excel: {e}"
        )

    print(
        "IMPORTADOR: Excel abierto correctamente.",
        flush=True,
    )

    # ========================================================
    # 2) SELECCIONAR PRIMERA HOJA
    # ========================================================

    try:

        ws = wb.worksheets[0]

    except Exception as e:

        wb.close()

        print(
            f"ERROR OBTENIENDO HOJA DEL EXCEL: {e}",
            flush=True,
        )

        raise ValueError(
            "El Excel no contiene ninguna hoja."
        )

    print(
        f"HOJA SELECCIONADA: {ws.title}",
        flush=True,
    )

    # ========================================================
    # 3) LEER CABECERA
    # ========================================================

    print(
        "IMPORTADOR: leyendo cabecera...",
        flush=True,
    )

    try:

        filas = ws.iter_rows(
            values_only=True
        )

        cabecera_original = next(filas)

    except StopIteration:

        wb.close()

        raise ValueError(
            "El Excel está vacío."
        )

    except Exception as e:

        wb.close()

        print(
            f"ERROR LEYENDO CABECERA: {e}",
            flush=True,
        )

        raise ValueError(
            f"No se pudo leer la cabecera del Excel: {e}"
        )

    # ========================================================
    # 4) NORMALIZAR CABECERAS
    # ========================================================

    columnas = []

    for columna in cabecera_original:

        if columna is None:

            columnas.append("")

        else:

            columnas.append(
                str(columna).strip().upper()
            )

    print(
        f"TOTAL COLUMNAS EXCEL: {len(columnas)}",
        flush=True,
    )

    print(
        "COLUMNAS NORMALIZADAS:",
        flush=True,
    )

    print(
        columnas,
        flush=True,
    )

    # ========================================================
    # 5) LOCALIZAR COLUMNAS OBLIGATORIAS
    # ========================================================

    try:

        indice_fecha_alta = columnas.index(
            "FECHAALTA"
        )

    except ValueError:

        wb.close()

        raise ValueError(
            "El Excel no contiene la columna FECHAALTA."
        )

    try:

        indice_id_expediente = columnas.index(
            "IDEXPEDIENTE"
        )

    except ValueError:

        wb.close()

        raise ValueError(
            "El Excel no contiene la columna IDEXPEDIENTE."
        )

    print(
        f"ÍNDICE FECHAALTA: {indice_fecha_alta}",
        flush=True,
    )

    print(
        f"ÍNDICE IDEXPEDIENTE: "
        f"{indice_id_expediente}",
        flush=True,
    )

    # ========================================================
    # 6) CONTADORES DE LECTURA
    # ========================================================

    total_filas_excel = 0
    fechas_validas = 0
    filas_fecha = 0
    filas_sin_id = 0

    # ========================================================
    # 7) LISTA DE FILAS QUE SÍ NOS INTERESAN
    #
    # Importante:
    #
    # No guardamos las 120.000 filas.
    #
    # Solo guardamos las filas cuya FECHAALTA coincide
    # con la fecha solicitada.
    # ========================================================

    filas_filtradas = []

    print(
        f"IMPORTADOR: buscando filas con "
        f"FECHAALTA = {fecha_objetivo}...",
        flush=True,
    )

    # ========================================================
    # 8) RECORRER EXCEL FILA A FILA
    # ========================================================

    try:

        for valores_fila in filas:

            total_filas_excel += 1

            # ------------------------------------------------
            # Convertir la fila a diccionario.
            #
            # Solo tendremos en memoria las filas que
            # realmente coincidan con la fecha.
            # ------------------------------------------------

            fila = {}

            for indice, valor in enumerate(
                valores_fila
            ):

                if indice >= len(columnas):
                    break

                nombre_columna = columnas[indice]

                if not nombre_columna:
                    continue

                fila[nombre_columna] = valor

            # ------------------------------------------------
            # FECHAALTA
            # ------------------------------------------------

            valor_fecha = (
                valores_fila[indice_fecha_alta]
                if indice_fecha_alta < len(valores_fila)
                else None
            )

            if valor_fecha is not None:

                fecha_fila = convertir_fecha(
                    valor_fecha
                )

                if fecha_fila is not None:

                    fechas_validas += 1

                    if fecha_fila != fecha_objetivo:

                        continue

                else:

                    continue

            else:

                continue

            # ------------------------------------------------
            # FILA DE LA FECHA OBJETIVO
            # ------------------------------------------------

            filas_fecha += 1

            # ------------------------------------------------
            # IDEXPEDIENTE
            # ------------------------------------------------

            valor_id = (
                valores_fila[indice_id_expediente]
                if indice_id_expediente < len(valores_fila)
                else None
            )

            idexp = limpiar_texto(
                valor_id
            )

            if not idexp:

                filas_sin_id += 1

                continue

            fila["IDEXPEDIENTE"] = idexp

            filas_filtradas.append(
                fila
            )

            # ------------------------------------------------
            # LOG DE PROGRESO DE LECTURA
            # ------------------------------------------------

            if filas_fecha % 100 == 0:

                print(
                    f"LECTURA EXCEL: "
                    f"{total_filas_excel} filas revisadas "
                    f"| fecha objetivo={filas_fecha}",
                    flush=True,
                )

    except Exception as e:

        wb.close()

        print(
            f"ERROR RECORRIENDO EXCEL: {e}",
            flush=True,
        )

        raise ValueError(
            f"Error recorriendo el Excel: {e}"
        )

    finally:

        try:
            wb.close()
        except Exception:
            pass

    # ========================================================
    # 9) RESULTADO DE LA LECTURA
    # ========================================================

    print(
        "IMPORTADOR: lectura del Excel finalizada.",
        flush=True,
    )

    print(
        f"TOTAL FILAS EXCEL REVISADAS: "
        f"{total_filas_excel}",
        flush=True,
    )

    print(
        f"FECHAS VÁLIDAS: {fechas_validas}",
        flush=True,
    )

    print(
        f"FILAS DE LA FECHA {fecha_objetivo}: "
        f"{filas_fecha}",
        flush=True,
    )

    print(
        f"FILAS SIN IDEXPEDIENTE: "
        f"{filas_sin_id}",
        flush=True,
    )

    print(
        f"FILAS VÁLIDAS PARA IMPORTAR: "
        f"{len(filas_filtradas)}",
        flush=True,
    )

    # ========================================================
    # 10) SI NO HAY EXPEDIENTES
    # ========================================================

    if not filas_filtradas:

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
    # 11) IDS ÚNICOS
    # ========================================================

    ids_excel = []

    ids_vistos = set()

    for fila in filas_filtradas:

        idexp = fila.get(
            "IDEXPEDIENTE"
        )

        if not idexp:
            continue

        if idexp in ids_vistos:
            continue

        ids_vistos.add(idexp)

        ids_excel.append(
            idexp
        )

    print(
        f"IDS ÚNICOS EN EL EXCEL PARA LA FECHA: "
        f"{len(ids_excel)}",
        flush=True,
    )

    # ========================================================
    # 12) BUSCAR EXPEDIENTES EXISTENTES
    #
    # Se consulta en bloques para no generar una consulta
    # SQL demasiado grande.
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
    # 13) CONTADORES
    # ========================================================

    creados = 0
    actualizados = 0
    errores = 0
    procesados = 0

    # ========================================================
    # 14) PROCESAR FILAS FILTRADAS
    # ========================================================

    for fila in filas_filtradas:

        idexp = limpiar_texto(
            fila.get("IDEXPEDIENTE")
        )

        if not idexp:
            continue

        try:

            # ==================================================
            # BUSCAR EN MEMORIA
            # ==================================================

            exp = existentes_por_id.get(
                idexp
            )

            # ==================================================
            # CREAR
            # ==================================================

            if exp is None:

                exp = Expediente(
                    id_expediente=idexp
                )

                db.add(exp)

                existentes_por_id[
                    idexp
                ] = exp

                creados += 1

            else:

                actualizados += 1

            # ==================================================
            # ESTADOS
            # ==================================================

            exp.estado_expediente = obtener_valor(
                fila,
                "ESTADOEXPEDIENTE",
            )

            exp.estado_expediente_ancert = obtener_valor(
                fila,
                "ESTADOEXPEDIENTEANCERT",
            )

            # ==================================================
            # FECHAS
            # ==================================================

            exp.fecha_alta = convertir_fecha(
                fila.get("FECHAALTA")
            )

            exp.fecha_firma = convertir_fecha(
                fila.get("FECHAFIRMA")
            )

            exp.fecha_inscripcion = convertir_fecha(
                fila.get("FECHAINSCRIPCION")
            )

            exp.fecha_entregado_cliente = convertir_fecha(
                fila.get("FECHAENTREGADOCLIENTE")
            )

            exp.fecha_prevista_firma = convertir_fecha(
                fila.get("FECHAPREVISTAFIRMA")
            )

            exp.fecha_vencimiento = convertir_fecha(
                fila.get("FECHAVENCIMIENTO")
            )

            exp.fecha_sol_cgn = convertir_fecha(
                fila.get("FECHASOLCGN")
            )

            exp.fecha_firma_prev_val = convertir_fecha(
                fila.get("FECHAFIRMAPREVVAL")
            )

            exp.fecha_firma_prev_cli = convertir_fecha(
                fila.get("FECHAFIRMAPREVCLI")
            )

            exp.fecha_inicio_actividad = convertir_fecha(
                fila.get("FECHAINICIOACTIVIDAD")
            )

            exp.fecha_fin_actividad = convertir_fecha(
                fila.get("FECHAFINACTIVIDAD")
            )

            exp.fcierre_defecto = convertir_fecha(
                fila.get("FCIERREDEFECTO")
            )

            # ==================================================
            # ACTIVIDAD
            # ==================================================

            exp.actividad_actual = obtener_valor(
                fila,
                "ACTIVIDADACTUAL",
            )

            exp.estado_actividad = obtener_valor(
                fila,
                "ESTADOACTIVIDAD",
            )

            # ==================================================
            # SOLICITANTE
            # ==================================================

            exp.nombre_solicitante = obtener_valor(
                fila,
                "NOMBRESOLICITANTE",
                "NOMBRE_SOLICITANTE",
            )

            exp.nif_solicitante = obtener_valor(
                fila,
                "NIFSOLICITANTE",
                "NIF_SOLICITANTE",
            )

            # ==================================================
            # TITULAR
            # ==================================================

            exp.nombre_titular = obtener_valor(
                fila,
                "NOMBRETITULAR",
                "NOMBRE_TITULAR",
            )

            exp.nif_titular = obtener_valor(
                fila,
                "NIFTITULAR",
                "NIF_TITULAR",
            )

            # ==================================================
            # APODERADO
            # ==================================================

            exp.apoderado = obtener_valor(
                fila,
                "APODERADO",
            )

            # ==================================================
            # NOTARIO
            # ==================================================

            exp.nombre_notario = obtener_valor(
                fila,
                "NOMBRENOTARIO",
                "NOMBRE_NOTARIO",
            )

            exp.nif_notario = obtener_valor(
                fila,
                "NIFNOTARIO",
                "NIF_NOTARIO",
            )

            exp.notario = obtener_valor(
                fila,
                "NOTARIO",
                "NOMBRENOTARIO",
                "NOMBRE_NOTARIO",
            )

            # ==================================================
            # OFICINA
            # ==================================================

            exp.oficina = obtener_valor(
                fila,
                "OFICINA",
            )

            exp.oficina_alta = obtener_valor(
                fila,
                "OFICINAALTA",
                "OFICINA_ALTA",
            )

            exp.dan = obtener_valor(
                fila,
                "DAN",
            )

            # ==================================================
            # ECONÓMICOS
            # ==================================================

            exp.capital = convertir_numero(
                fila.get("CAPITAL")
            )

            exp.importe = convertir_numero(
                fila.get("IMPORTE")
            )

            exp.saldo_real = convertir_numero(
                fila.get("SALDOREAL")
            )

            exp.saldo_disponible = convertir_numero(
                fila.get("SALDODISPONIBLE")
            )

            # ==================================================
            # PROVISIÓN
            # ==================================================

            exp.id_provision = obtener_valor(
                fila,
                "IDPROVISION",
                "ID_PROVISION",
            )

            exp.tipo_provision = obtener_valor(
                fila,
                "TIPOPROVISION",
                "TIPO_PROVISION",
            )

            # ==================================================
            # OPERACIÓN
            # ==================================================

            exp.contrato = obtener_valor(
                fila,
                "CONTRATO",
            )

            exp.num_solicitud_sia = obtener_valor(
                fila,
                "NUMSOLICITUDSIA",
                "NUM_SOLICITUD_SIA",
            )

            exp.tipo_operacion = obtener_valor(
                fila,
                "TIPOOPERACION",
                "TIPO_OPERACION",
            )

            exp.subtipo_operacion = obtener_valor(
                fila,
                "SUBTIPOOPERACION",
                "SUBTIPO_OPERACION",
            )

            exp.vinccanc = obtener_valor(
                fila,
                "VINCCANC",
            )

            exp.protocolo = obtener_valor(
                fila,
                "PROTOCOLO",
            )

            # ==================================================
            # GTG / BANKIA
            # ==================================================

            exp.origen_bankia = obtener_valor(
                fila,
                "ORIGENBANKIA",
                "ORIGEN_BANKIA",
            )

            exp.producto_gtg = obtener_valor(
                fila,
                "PRODUCTOGTG",
                "PRODUCTO_GTG",
            )

            exp.dt = obtener_valor(
                fila,
                "DT",
            )

            # ==================================================
            # GESTORÍA
            # ==================================================

            exp.id_gestoria_tramite = obtener_valor(
                fila,
                "IDGESTORIATRAMITE",
                "ID_GESTORIA_TRAMITE",
            )

            exp.nombre_gestoria = obtener_valor(
                fila,
                "NOMBREGESTORIA",
                "NOMBRE_GESTORIA",
            )

            exp.gestoria = obtener_valor(
                fila,
                "GESTORIA",
                "NOMBREGESTORIA",
                "NOMBRE_GESTORIA",
            )

            # ==================================================
            # FINCA
            # ==================================================

            exp.finca = obtener_valor(
                fila,
                "FINCA",
            )

            # ==================================================
            # DEFECTOS
            # ==================================================

            exp.tiene_defectos_abiertos = obtener_valor(
                fila,
                "TIENEDEFECTOSABIERTOS",
                "TIENE_DEFECTOS_ABIERTOS",
            )

            exp.tipo_error = obtener_valor(
                fila,
                "TIPOERROR",
                "TIPO_ERROR",
            )

            exp.descripcion_error = obtener_valor(
                fila,
                "DESCRIPCIONERROR",
                "DESCRIPCION_ERROR",
            )

            exp.falta_defecto = obtener_valor(
                fila,
                "FALTADEFECTO",
                "FALTA_DEFECTO",
            )

            # ==================================================
            # CGN
            # ==================================================

            exp.id_expediente_cgn = obtener_valor(
                fila,
                "IDEXPEDIENTECGN",
                "ID_EXPEDIENTE_CGN",
            )

            # ==================================================
            # ACTA
            # ==================================================

            exp.tipo_acta = obtener_valor(
                fila,
                "TIPOACTA",
                "TIPO_ACTA",
            )

            # ==================================================
            # OTROS
            # ==================================================

            exp.lucy = obtener_valor(
                fila,
                "LUCY",
            )

            exp.indicador_tt = obtener_valor(
                fila,
                "INDICADORTT",
                "INDICADOR_TT",
            )

            # ==================================================
            # OBSERVACIONES
            # ==================================================

            exp.observaciones = obtener_valor(
                fila,
                "OBSERVACIONES",
            )

            # ==================================================
            # FACTURACIÓN
            # ==================================================

            exp.facturacion_estado = obtener_valor(
                fila,
                "FACTURACIONESTADO",
                "FACTURACION_ESTADO",
            )

            exp.facturacion_fecha = convertir_fecha(
                obtener_valor(
                    fila,
                    "FACTURACIONFECHA",
                    "FACTURACION_FECHA",
                )
            )

            # ==================================================
            # REGISTRAL
            # ==================================================

            exp.registral_estado = obtener_valor(
                fila,
                "REGISTRALESTADO",
                "REGISTRAL_ESTADO",
            )

            exp.registral_fecha = convertir_fecha(
                obtener_valor(
                    fila,
                    "REGISTRALFECHA",
                    "REGISTRAL_FECHA",
                )
            )

            # ==================================================
            # CONTADOR
            # ==================================================

            procesados += 1

            # ==================================================
            # PROGRESO
            # ==================================================

            if (
                procesados % 25 == 0
                or procesados == len(filas_filtradas)
            ):

                print(
                    f"PROGRESO: "
                    f"{procesados}/{len(filas_filtradas)} "
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
            # Rollback del expediente problemático.
            # ------------------------------------------------

            db.rollback()

            # ------------------------------------------------
            # Reconstruir el mapa de expedientes existentes.
            #
            # Después del rollback, los objetos nuevos pueden
            # haber quedado fuera de la sesión.
            # ------------------------------------------------

            existentes_por_id = {}

            try:

                for inicio in range(
                    0,
                    len(ids_excel),
                    BATCH_SIZE,
                ):

                    bloque_ids = ids_excel[
                        inicio:inicio + BATCH_SIZE
                    ]

                    existentes_db = (
                        db.query(Expediente)
                        .filter(
                            Expediente.id_expediente.in_(
                                bloque_ids
                            )
                        )
                        .all()
                    )

                    for expediente_db in existentes_db:

                        clave = limpiar_texto(
                            expediente_db.id_expediente
                        )

                        if clave:

                            existentes_por_id[
                                clave
                            ] = expediente_db

            except Exception as reconstruccion_error:

                print(
                    "ERROR RECONSTRUYENDO MAPA "
                    "DE EXPEDIENTES: "
                    f"{reconstruccion_error}",
                    flush=True,
                )

                raise

    # ========================================================
    # 15) COMMIT FINAL
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
    # 16) RESULTADO
    # ========================================================

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - FINALIZADO", flush=True)

    print(
        f"FECHA: {fecha_objetivo}",
        flush=True,
    )

    print(
        f"FILAS EXCEL REVISADAS: "
        f"{total_filas_excel}",
        flush=True,
    )

    print(
        f"FILAS DE LA FECHA: "
        f"{filas_fecha}",
        flush=True,
    )

    print(
        f"FILAS VÁLIDAS: "
        f"{len(filas_filtradas)}",
        flush=True,
    )

    print(
        f"PROCESADOS: "
        f"{procesados}",
        flush=True,
    )

    print(
        f"CREADOS: "
        f"{creados}",
        flush=True,
    )

    print(
        f"ACTUALIZADOS: "
        f"{actualizados}",
        flush=True,
    )

    print(
        f"ERRORES: "
        f"{errores}",
        flush=True,
    )

    print("============================================", flush=True)

    return {
        "creados": creados,
        "actualizados": actualizados,
        "errores": errores,
        "fecha_importada": fecha_objetivo.isoformat(),
        "total_filtrados": len(filas_filtradas),
        "total_procesados": procesados,
    }
