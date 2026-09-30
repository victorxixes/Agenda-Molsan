import io
from datetime import date, datetime
from typing import Optional

from openpyxl import load_workbook
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente


# ============================================================
# CONFIGURACIÓN
# ============================================================

# Cada cuántos expedientes procesados hacemos commit.
BATCH_SIZE = 100


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def limpiar_valor(valor):
    """
    Limpia valores procedentes de Excel.

    Convierte:
    - None -> None
    - NaN -> None
    - cadenas vacías -> None
    """
    if valor is None:
        return None

    if isinstance(valor, str):
        valor = valor.strip()

        if not valor:
            return None

    return valor


def convertir_fecha(valor) -> Optional[date]:
    """
    Convierte un valor de Excel a date.

    Soporta:
    - datetime
    - date
    - cadenas DD/MM/YYYY
    - cadenas YYYY-MM-DD
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

        formatos = (
            "%d/%m/%Y",
            "%Y-%m-%d",
            "%d-%m-%Y",
        )

        for formato in formatos:

            try:
                return datetime.strptime(
                    valor,
                    formato
                ).date()

            except ValueError:
                continue

    return None


def valor_columna(fila, columnas, nombre):
    """
    Obtiene el valor de una columna del Excel
    independientemente de mayúsculas/minúsculas
    y espacios.
    """

    indice = columnas.get(nombre.upper())

    if indice is None:
        return None

    return limpiar_valor(
        fila[indice]
    )


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

    El proceso NO carga todo el Excel en un DataFrame.

    Se utiliza openpyxl en modo read_only para recorrer
    las filas de forma progresiva.

    Solamente se procesan las filas cuya FECHAALTA
    coincide con fecha_objetivo.

    Ejemplo:

        Excel:
            08/11/2025
            19/09/2025
            08/11/2025
            ...

        fecha_objetivo = 2025-11-08

        Solamente se importan las filas del 08/11/2025.
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
    # 2) ABRIR EXCEL EN MODO SOLO LECTURA
    # ========================================================

    print(
        "IMPORTADOR: abriendo Excel en modo streaming...",
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
            "Formato inválido o archivo corrupto."
        )

    print(
        f"HOJAS ENCONTRADAS: {wb.sheetnames}",
        flush=True
    )

    # ========================================================
    # 3) BUSCAR LA HOJA CORRECTA
    # ========================================================

    hoja = None
    columnas = None

    for nombre_hoja in wb.sheetnames:

        print(
            f"IMPORTADOR: comprobando hoja '{nombre_hoja}'...",
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
                f"HOJA '{nombre_hoja}' VACÍA",
                flush=True
            )

            continue

        columnas_detectadas = {}

        for indice, valor in enumerate(
            primera_fila
        ):

            if valor is None:
                continue

            nombre_columna = str(
                valor
            ).strip().upper()

            columnas_detectadas[
                nombre_columna
            ] = indice

        print(
            f"COLUMNAS DETECTADAS EN '{nombre_hoja}': "
            f"{list(columnas_detectadas.keys())}",
            flush=True
        )

        if (
            "FECHAALTA" in columnas_detectadas
            and
            "IDEXPEDIENTE" in columnas_detectadas
        ):

            hoja = ws
            columnas = columnas_detectadas

            print(
                f"HOJA SELECCIONADA: {nombre_hoja}",
                flush=True
            )

            break

    if hoja is None:

        wb.close()

        raise ValueError(
            "No se ha encontrado ninguna hoja que contenga "
            "las columnas FECHAALTA e IDEXPEDIENTE."
        )

    # ========================================================
    # 4) MOSTRAR INFORMACIÓN DE COLUMNAS
    # ========================================================

    print(
        "============================================",
        flush=True
    )

    print(
        "COLUMNAS PRINCIPALES DETECTADAS:",
        flush=True
    )

    print(
        f"IDEXPEDIENTE -> índice {columnas['IDEXPEDIENTE']}",
        flush=True
    )

    print(
        f"FECHAALTA -> índice {columnas['FECHAALTA']}",
        flush=True
    )

    print(
        f"TOTAL COLUMNAS: {len(columnas)}",
        flush=True
    )

    print(
        "============================================",
        flush=True
    )

    # ========================================================
    # 5) CONTADORES
    # ========================================================

    filas_excel = 0
    filas_fecha = 0
    filas_sin_id = 0
    fechas_invalidas = 0

    creados = 0
    actualizados = 0
    errores = 0
    procesados = 0

    # ========================================================
    # 6) IDS YA EXISTENTES
    # ========================================================

    existentes_por_id = {}

    # ========================================================
    # 7) RECORRER EXCEL FILA POR FILA
    # ========================================================

    print(
        "IMPORTADOR: comenzando lectura fila a fila...",
        flush=True
    )

    try:

        for fila in hoja.iter_rows(
            min_row=2,
            values_only=True
        ):

            filas_excel += 1

            # ------------------------------------------------
            # FECHAALTA
            # ------------------------------------------------

            valor_fecha = fila[
                columnas["FECHAALTA"]
            ]

            fecha_alta = convertir_fecha(
                valor_fecha
            )

            if fecha_alta is None:

                fechas_invalidas += 1

                continue

            # ------------------------------------------------
            # FILTRAR INMEDIATAMENTE POR FECHA
            # ------------------------------------------------

            if fecha_alta != fecha_objetivo:

                continue

            filas_fecha += 1

            # ------------------------------------------------
            # IDEXPEDIENTE
            # ------------------------------------------------

            idexp = fila[
                columnas["IDEXPEDIENTE"]
            ]

            idexp = limpiar_valor(
                idexp
            )

            if idexp is None:

                filas_sin_id += 1

                continue

            idexp = str(
                idexp
            ).strip()

            if not idexp:

                filas_sin_id += 1

                continue

            # ------------------------------------------------
            # PROGRESO DE LECTURA
            # ------------------------------------------------

            if filas_excel % 10000 == 0:

                print(
                    f"LECTURA EXCEL: {filas_excel} filas "
                    f"| fecha objetivo={filas_fecha} "
                    f"| procesados={procesados}",
                    flush=True
                )

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
                            Expediente.id_expediente == idexp
                        )
                        .first()
                    )

                    if exp is not None:

                        existentes_por_id[
                            idexp
                        ] = exp

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
                # FECHAS
                # =================================================

                exp.fecha_alta = fecha_alta

                exp.fecha_firma = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHAFIRMA"
                    )
                )

                exp.fecha_inscripcion = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHAINSCRIPCION"
                    )
                )

                exp.fecha_entregado_cliente = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHAENTREGADOCLIENTE"
                    )
                )

                exp.fecha_prevista_firma = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHAPREVISTAFIRMA"
                    )
                )

                exp.fecha_vencimiento = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHAVENCIMIENTO"
                    )
                )

                exp.fecha_sol_cgn = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHASOLCGN"
                    )
                )

                exp.fecha_firma_prev_val = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHAFIRMAPREVVAL"
                    )
                )

                exp.fecha_firma_prev_cli = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHAFIRMAPREVCLI"
                    )
                )

                # =================================================
                # ESTADOS
                # =================================================

                exp.estado_expediente = (
                    valor_columna(
                        fila,
                        columnas,
                        "ESTADOEXPEDIENTE"
                    )
                )

                exp.estado_expediente_ancert = (
                    valor_columna(
                        fila,
                        columnas,
                        "ESTADOEXPEDIENTEANCERT"
                    )
                )

                # =================================================
                # ACTIVIDAD
                # =================================================

                exp.actividad_actual = (
                    valor_columna(
                        fila,
                        columnas,
                        "ACTIVIDADACTUAL"
                    )
                )

                exp.estado_actividad = (
                    valor_columna(
                        fila,
                        columnas,
                        "ESTADOACTIVIDAD"
                    )
                )

                exp.fecha_inicio_actividad = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHAINICIOACTIVIDAD"
                    )
                )

                exp.fecha_fin_actividad = convertir_fecha(
                    valor_columna(
                        fila,
                        columnas,
                        "FECHAFINACTIVIDAD"
                    )
                )

                # =================================================
                # TITULAR
                # =================================================

                exp.nombre_titular = (
                    valor_columna(
                        fila,
                        columnas,
                        "NOMBRETITULAR"
                    )
                )

                exp.nif_titular = (
                    valor_columna(
                        fila,
                        columnas,
                        "NIFTITULAR"
                    )
                )

                # =================================================
                # NOTARIO
                # =================================================

                exp.nombre_notario = (
                    valor_columna(
                        fila,
                        columnas,
                        "NOMBRENOTARIO"
                    )
                )

                exp.nif_notario = (
                    valor_columna(
                        fila,
                        columnas,
                        "NIFNOTARIO"
                    )
                )

                exp.notario = (
                    valor_columna(
                        fila,
                        columnas,
                        "NOTARIO"
                    )
                    or exp.nombre_notario
                )

                # =================================================
                # OFICINA
                # =================================================

                exp.oficina = (
                    valor_columna(
                        fila,
                        columnas,
                        "OFICINA"
                    )
                )

                exp.oficina_alta = (
                    valor_columna(
                        fila,
                        columnas,
                        "OFICINAALTA"
                    )
                )

                exp.dan = (
                    valor_columna(
                        fila,
                        columnas,
                        "DAN"
                    )
                )

                # =================================================
                # ECONÓMICOS
                # =================================================

                exp.capital = (
                    valor_columna(
                        fila,
                        columnas,
                        "CAPITAL"
                    )
                )

                exp.importe = (
                    valor_columna(
                        fila,
                        columnas,
                        "IMPORTE"
                    )
                )

                exp.saldo_real = (
                    valor_columna(
                        fila,
                        columnas,
                        "SALDOREAL"
                    )
                )

                exp.saldo_disponible = (
                    valor_columna(
                        fila,
                        columnas,
                        "SALDODISPONIBLE"
                    )
                )

                # =================================================
                # OPERACIÓN
                # =================================================

                exp.contrato = (
                    valor_columna(
                        fila,
                        columnas,
                        "CONTRATO"
                    )
                )

                exp.num_solicitud_sia = (
                    valor_columna(
                        fila,
                        columnas,
                        "NUMSOLICITUDSIA"
                    )
                )

                exp.tipo_operacion = (
                    valor_columna(
                        fila,
                        columnas,
                        "TIPOOPERACION"
                    )
                )

                exp.subtipo_operacion = (
                    valor_columna(
                        fila,
                        columnas,
                        "SUBTIPOOPERACION"
                    )
                )

                exp.vinccanc = (
                    valor_columna(
                        fila,
                        columnas,
                        "VINCCANC"
                    )
                )

                exp.protocolo = (
                    valor_columna(
                        fila,
                        columnas,
                        "PROTOCOLO"
                    )
                )

                # =================================================
                # GTG / BANKIA
                # =================================================

                exp.origen_bankia = (
                    valor_columna(
                        fila,
                        columnas,
                        "ORIGENBANKIA"
                    )
                )

                exp.producto_gtg = (
                    valor_columna(
                        fila,
                        columnas,
                        "PRODUCTOGTG"
                    )
                )

                exp.dt = (
                    valor_columna(
                        fila,
                        columnas,
                        "DT"
                    )
                )

                # =================================================
                # GESTORÍA
                # =================================================

                # El Excel ABSIS utiliza NOMBREGESTORIA.
                exp.gestoria = (
                    valor_columna(
                        fila,
                        columnas,
                        "NOMBREGESTORIA"
                    )
                    or valor_columna(
                        fila,
                        columnas,
                        "GESTORIA"
                    )
                )

                # =================================================
                # CGN
                # =================================================

                exp.id_expediente_cgn = (
                    valor_columna(
                        fila,
                        columnas,
                        "IDEXPEDIENTECGN"
                    )
                )

                # =================================================
                # OTROS
                # =================================================

                exp.lucy = (
                    valor_columna(
                        fila,
                        columnas,
                        "LUCY"
                    )
                )

                exp.indicador_tt = (
                    valor_columna(
                        fila,
                        columnas,
                        "INDICADORTT"
                    )
                )

                # =================================================
                # OBSERVACIONES
                # =================================================

                exp.observaciones = (
                    valor_columna(
                        fila,
                        columnas,
                        "OBSERVACIONES"
                    )
                )

                procesados += 1

                # =================================================
                # LOG DE PROGRESO
                # =================================================

                if procesados % 25 == 0:

                    print(
                        f"PROCESAMIENTO: {procesados} expedientes "
                        f"| creados={creados} "
                        f"| actualizados={actualizados}",
                        flush=True
                    )

                # =================================================
                # COMMIT POR LOTES
                # =================================================

                if procesados % BATCH_SIZE == 0:

                    print(
                        f"GUARDANDO LOTE: "
                        f"{procesados // BATCH_SIZE}",
                        flush=True
                    )

                    db.commit()

            except Exception as e:

                errores += 1

                print(
                    f"ERROR PROCESANDO "
                    f"IDEXPEDIENTE={idexp}: {e}",
                    flush=True
                )

                db.rollback()

                # Después del rollback necesitamos reconstruir
                # el diccionario de objetos cargados porque
                # SQLAlchemy puede haber invalidado su estado.

                existentes_por_id = {}

    finally:

        wb.close()

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

    print(
        "============================================",
        flush=True
    )

    print(
        "IMPORTADOR ABSIS - FINALIZADO",
        flush=True
    )

    print(
        f"FECHA OBJETIVO: {fecha_objetivo}",
        flush=True
    )

    print(
        f"FILAS LEÍDAS DEL EXCEL: {filas_excel}",
        flush=True
    )

    print(
        f"FILAS DE LA FECHA OBJETIVO: {filas_fecha}",
        flush=True
    )

    print(
        f"FILAS SIN IDEXPEDIENTE: {filas_sin_id}",
        flush=True
    )

    print(
        f"FECHAS NO VÁLIDAS: {fechas_invalidas}",
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
        "total_filtrados": filas_fecha,
        "total_procesados": procesados,
        "total_filas_excel": filas_excel,
        "filas_sin_id": filas_sin_id,
        "fechas_invalidas": fechas_invalidas
    }

