
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

def limpiar_valor(valor):
    """
    Convierte valores del Excel a valores adecuados para SQLAlchemy.

    Evita guardar NaN/NaT y convierte valores vacíos en None.
    """
    if valor is None:
        return None

    if isinstance(valor, str):
        valor = valor.strip()
        return valor if valor else None

    return valor


def convertir_fecha(valor):
    """
    Convierte cualquier representación razonable de fecha
    procedente de ABSIS a datetime.date.

    El Excel normalmente contiene fechas como:
        08/11/2025

    Pero openpyxl también puede devolver directamente
    datetime/date dependiendo de cómo esté construido el Excel.
    """

    if valor is None:
        return None

    # Excel puede devolver datetime
    if isinstance(valor, datetime):
        return valor.date()

    # Excel puede devolver date
    if isinstance(valor, date):
        return valor

    # Si viene como texto
    if isinstance(valor, str):
        texto = valor.strip()

        if not texto:
            return None

        formatos = (
            "%d/%m/%Y",
            "%d-%m-%Y",
            "%Y-%m-%d",
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

    return None


def obtener_valor(row_dict, *nombres):
    """
    Devuelve el primer valor disponible de los nombres indicados.
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

    El Excel puede tener más de 100.000 filas y 50+ columnas.

    NO se utiliza pandas para cargar todo el Excel en memoria.

    Se utiliza openpyxl en modo read_only=True y se procesa
    el Excel fila a fila.

    Únicamente se importan las filas cuya FECHAALTA coincide
    con fecha_objetivo.

    Ejemplo:

        Excel:
            08/11/2025
            19/09/2025
            08/11/2025
            ...

        fecha_objetivo = 08/11/2025

        Solo se procesan las filas del 08/11/2025.
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
    # 1) ABRIR EXCEL EN MODO READ ONLY
    # ========================================================

    print(
        "IMPORTADOR: abriendo Excel en modo READ_ONLY...",
        flush=True
    )

    try:
        libro = openpyxl.load_workbook(
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

        hojas = libro.sheetnames

        print(
            f"HOJAS ENCONTRADAS: {hojas}",
            flush=True
        )

        # ====================================================
        # 2) BUSCAR LA HOJA CORRECTA
        # ====================================================

        hoja = None
        cabeceras = None

        for nombre_hoja in hojas:

            print(
                f"IMPORTADOR: inspeccionando hoja "
                f"'{nombre_hoja}'...",
                flush=True
            )

            ws = libro[nombre_hoja]

            filas = ws.iter_rows(
                min_row=1,
                max_row=1,
                values_only=True
            )

            primera_fila = next(
                filas,
                None
            )

            if not primera_fila:
                print(
                    f"HOJA '{nombre_hoja}' VACÍA",
                    flush=True
                )
                continue

            columnas = []

            for valor in primera_fila:

                if valor is None:
                    columnas.append("")
                else:
                    columnas.append(
                        str(valor).strip().upper()
                    )

            print(
                f"HOJA '{nombre_hoja}' - "
                f"PRIMERAS COLUMNAS: "
                f"{columnas[:10]}",
                flush=True
            )

            tiene_id = "IDEXPEDIENTE" in columnas
            tiene_fecha = "FECHAALTA" in columnas

            print(
                f"HOJA '{nombre_hoja}' - "
                f"IDEXPEDIENTE={tiene_id} "
                f"FECHAALTA={tiene_fecha}",
                flush=True
            )

            if tiene_id and tiene_fecha:

                hoja = ws
                cabeceras = columnas

                print(
                    f"IMPORTADOR: hoja válida encontrada: "
                    f"'{nombre_hoja}'",
                    flush=True
                )

                break

        # ====================================================
        # 3) VALIDAR HOJA
        # ====================================================

        if hoja is None:

            print(
                "IMPORTADOR: no se ha encontrado ninguna "
                "hoja válida.",
                flush=True
            )

            raise ValueError(
                "No se ha encontrado ninguna hoja que contenga "
                "las columnas FECHAALTA e IDEXPEDIENTE."
            )

        # ====================================================
        # 4) POSICIONES DE COLUMNAS
        # ====================================================

        indice_id = cabeceras.index(
            "IDEXPEDIENTE"
        )

        indice_fecha = cabeceras.index(
            "FECHAALTA"
        )

        print(
            f"COLUMNA IDEXPEDIENTE: posición {indice_id}",
            flush=True
        )

        print(
            f"COLUMNA FECHAALTA: posición {indice_fecha}",
            flush=True
        )

        print(
            f"TOTAL COLUMNAS DETECTADAS: "
            f"{len(cabeceras)}",
            flush=True
        )

        # ====================================================
        # 5) CONTADORES
        # ====================================================

        filas_excel = 0
        filas_fecha = 0
        filas_validas = 0

        creados = 0
        actualizados = 0
        errores = 0
        procesados = 0

        # ====================================================
        # 6) CACHE DE EXPEDIENTES
        # ====================================================

        existentes_por_id = {}

        # ====================================================
        # 7) RECORRER EXCEL
        # ====================================================

        print(
            "IMPORTADOR: comenzando lectura fila a fila...",
            flush=True
        )

        filas = hoja.iter_rows(
            min_row=2,
            values_only=True
        )

        for fila in filas:

            filas_excel += 1

            # ------------------------------------------------
            # LOG DE PROGRESO
            # ------------------------------------------------

            if filas_excel % 5000 == 0:

                print(
                    f"LECTURA EXCEL: "
                    f"{filas_excel} filas | "
                    f"coincidencias={filas_fecha} | "
                    f"procesados={procesados}",
                    flush=True
                )

            # ------------------------------------------------
            # COMPROBAR LONGITUD
            # ------------------------------------------------

            if len(fila) <= max(
                indice_id,
                indice_fecha
            ):
                continue

            # ------------------------------------------------
            # OBTENER FECHA
            # ------------------------------------------------

            fecha_excel = convertir_fecha(
                fila[indice_fecha]
            )

            # ------------------------------------------------
            # FILTRAR INMEDIATAMENTE
            # ------------------------------------------------

            if fecha_excel != fecha_objetivo:
                continue

            filas_fecha += 1

            # ------------------------------------------------
            # OBTENER ID
            # ------------------------------------------------

            idexp_raw = fila[indice_id]

            if idexp_raw is None:
                continue

            idexp = str(
                idexp_raw
            ).strip()

            if not idexp:
                continue

            filas_validas += 1

            # ------------------------------------------------
            # CONSTRUIR DICCIONARIO DE LA FILA
            # ------------------------------------------------

            row_dict = {}

            for posicion, nombre_columna in enumerate(cabeceras):

                if posicion < len(fila):

                    row_dict[
                        nombre_columna
                    ] = fila[posicion]

            # ------------------------------------------------
            # BUSCAR EXPEDIENTE EXISTENTE
            # ------------------------------------------------

            exp = existentes_por_id.get(idexp)

            if exp is None:

                exp = (
                    db.query(Expediente)
                    .filter(
                        Expediente.id_expediente == idexp
                    )
                    .first()
                )

                if exp is not None:
                    existentes_por_id[idexp] = exp

            # ------------------------------------------------
            # CREAR EXPEDIENTE
            # ------------------------------------------------

            if exp is None:

                exp = Expediente(
                    id_expediente=idexp
                )

                db.add(exp)

                existentes_por_id[idexp] = exp

                creados += 1

            # ------------------------------------------------
            # ACTUALIZAR EXPEDIENTE
            # ------------------------------------------------

            else:

                actualizados += 1

            try:

                # =================================================
                # FECHAS
                # =================================================

                exp.fecha_alta = fecha_excel

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

                # =================================================
                # ESTADOS
                # =================================================

                exp.estado_expediente = obtener_valor(
                    row_dict,
                    "ESTADOEXPEDIENTE"
                )

                exp.estado_expediente_ancert = obtener_valor(
                    row_dict,
                    "ESTADOEXPEDIENTEANCERT"
                )

                # =================================================
                # ACTIVIDAD
                # =================================================

                exp.actividad_actual = obtener_valor(
                    row_dict,
                    "ACTIVIDADACTUAL"
                )

                exp.estado_actividad = obtener_valor(
                    row_dict,
                    "ESTADOACTIVIDAD"
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

                # =================================================
                # TITULAR
                # =================================================

                exp.nombre_titular = obtener_valor(
                    row_dict,
                    "NOMBRETITULAR"
                )

                exp.nif_titular = obtener_valor(
                    row_dict,
                    "NIFTITULAR"
                )

                # =================================================
                # NOTARIO
                # =================================================

                exp.nombre_notario = obtener_valor(
                    row_dict,
                    "NOMBRENOTARIO"
                )

                exp.nif_notario = obtener_valor(
                    row_dict,
                    "NIFNOTARIO"
                )

                exp.notario = obtener_valor(
                    row_dict,
                    "NOTARIO",
                    "NOMBRENOTARIO"
                )

                # =================================================
                # OFICINA
                # =================================================

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

                # =================================================
                # ECONÓMICOS
                # =================================================

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

                # =================================================
                # OPERACIÓN
                # =================================================

                exp.contrato = obtener_valor(
                    row_dict,
                    "CONTRATO"
                )

                exp.num_solicitud_sia = obtener_valor(
                    row_dict,
                    "NUMSOLICITUDSIA"
                )

                exp.tipo_operacion = obtener_valor(
                    row_dict,
                    "TIPOOPERACION"
                )

                exp.subtipo_operacion = obtener_valor(
                    row_dict,
                    "SUBTIPOOPERACION"
                )

                exp.vinccanc = obtener_valor(
                    row_dict,
                    "VINCCANC"
                )

                exp.protocolo = obtener_valor(
                    row_dict,
                    "PROTOCOLO"
                )

                # =================================================
                # GTG / BANKIA
                # =================================================

                exp.origen_bankia = obtener_valor(
                    row_dict,
                    "ORIGENBANKIA"
                )

                exp.producto_gtg = obtener_valor(
                    row_dict,
                    "PRODUCTOGTG"
                )

                exp.dt = obtener_valor(
                    row_dict,
                    "DT"
                )

                # =================================================
                # GESTORÍA
                # =================================================

                exp.gestoria = obtener_valor(
                    row_dict,
                    "NOMBREGESTORIA",
                    "GESTORIA"
                )

                # =================================================
                # CGN
                # =================================================

                exp.id_expediente_cgn = obtener_valor(
                    row_dict,
                    "IDEXPEDIENTECGN"
                )

                # =================================================
                # OTROS
                # =================================================

                exp.lucy = obtener_valor(
                    row_dict,
                    "LUCY"
                )

                exp.indicador_tt = obtener_valor(
                    row_dict,
                    "INDICADORTT"
                )

                # =================================================
                # OBSERVACIONES
                # =================================================

                exp.observaciones = obtener_valor(
                    row_dict,
                    "OBSERVACIONES"
                )

                procesados += 1

                # ------------------------------------------------
                # LOG DE PROGRESO DE IMPORTACIÓN
                # ------------------------------------------------

                if procesados % 25 == 0:

                    print(
                        f"IMPORTACIÓN: "
                        f"{procesados} expedientes | "
                        f"creados={creados} | "
                        f"actualizados={actualizados}",
                        flush=True
                    )

                # ------------------------------------------------
                # COMMIT POR LOTES
                # ------------------------------------------------

                if procesados % BATCH_SIZE == 0:

                    print(
                        f"IMPORTADOR: "
                        f"commit lote "
                        f"{procesados // BATCH_SIZE}",
                        flush=True
                    )

                    db.commit()

            except Exception as e:

                errores += 1

                print(
                    f"ERROR PROCESANDO "
                    f"EXPEDIENTE {idexp}: {e}",
                    flush=True
                )

                db.rollback()

                # El objeto puede quedar invalidado después
                # del rollback. Lo quitamos de la caché.
                existentes_por_id.pop(
                    idexp,
                    None
                )

        # ========================================================
        # 8) COMMIT FINAL
        # ========================================================

        print(
            "IMPORTADOR: commit final...",
            flush=True
        )

        db.commit()

        # ========================================================
        # 9) RESULTADO
        # ========================================================

        print("============================================", flush=True)
        print("IMPORTADOR ABSIS - FINALIZADO", flush=True)
        print(f"FECHA OBJETIVO: {fecha_objetivo}", flush=True)
        print(f"FILAS LEÍDAS: {filas_excel}", flush=True)
        print(f"FILAS FECHA OBJETIVO: {filas_fecha}", flush=True)
        print(f"FILAS VÁLIDAS: {filas_validas}", flush=True)
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
            "total_filtrados": filas_fecha,
            "total_procesados": procesados
        }

    finally:

        # ========================================================
        # 10) CERRAR LIBRO
        # ========================================================

        try:
            libro.close()
        except Exception:
            pass

        print(
            "IMPORTADOR: Excel cerrado.",
            flush=True
        )

