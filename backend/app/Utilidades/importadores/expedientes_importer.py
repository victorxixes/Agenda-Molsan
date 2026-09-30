import pandas as pd
import io
from datetime import date
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente


# ============================================================
# CONFIGURACIÓN
# ============================================================

# Número de expedientes que se procesan antes de hacer commit.
BATCH_SIZE = 500


def importar_excel_expedientes(
    db: Session,
    contenido_excel: bytes,
    fecha_objetivo: date = None
):
    """
    Importa expedientes desde el Excel matriz ABSIS.

    IMPORTANTE:
    El Excel puede contener más de 100.000 filas.

    Solamente se procesan las filas cuya FECHAALTA coincide
    con fecha_objetivo.

    No se generan ExpedienteDetalle en esta importación.
    Los datos se guardan directamente en la tabla expedientes.
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
    # 1) LEER EXCEL
    # ========================================================

    print(
        "IMPORTADOR: leyendo Excel...",
        flush=True
    )

    try:
        df = pd.read_excel(
            io.BytesIO(contenido_excel)
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
        f"COLUMNAS: {list(df.columns)}",
        flush=True
    )

    # ========================================================
    # 2) COMPROBAR COLUMNAS OBLIGATORIAS
    # ========================================================

    if "FECHAALTA" not in df.columns:
        raise ValueError(
            "El Excel no contiene la columna FECHAALTA"
        )

    if "IDEXPEDIENTE" not in df.columns:
        raise ValueError(
            "El Excel no contiene la columna IDEXPEDIENTE"
        )

    # ========================================================
    # 3) CONVERTIR FECHAALTA
    # ========================================================

    print(
        "IMPORTADOR: convirtiendo FECHAALTA...",
        flush=True
    )

    df["FECHAALTA"] = pd.to_datetime(
        df["FECHAALTA"],
        errors="coerce"
    ).dt.date

    # ========================================================
    # 4) FILTRAR ÚNICAMENTE LA FECHA OBJETIVO
    # ========================================================

    print(
        f"IMPORTADOR: buscando expedientes del día "
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
    # 5) SI NO HAY EXPEDIENTES
    # ========================================================

    if total_filtrados == 0:

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
    # 6) LIMPIAR IDENTIFICADORES
    # ========================================================

    df_filtrado["IDEXPEDIENTE"] = (
        df_filtrado["IDEXPEDIENTE"]
        .astype(str)
        .str.strip()
    )

    # Eliminar filas sin identificador válido.
    df_filtrado = df_filtrado[
        (df_filtrado["IDEXPEDIENTE"] != "") &
        (df_filtrado["IDEXPEDIENTE"] != "nan")
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
    # 7) OBTENER TODOS LOS IDS DEL EXCEL
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
    # 8) BUSCAR DE UNA VEZ LOS EXPEDIENTES EXISTENTES
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
    # 9) CONTADORES
    # ========================================================

    creados = 0
    actualizados = 0
    errores = 0
    procesados = 0

    nuevos_en_batch = []

    # ========================================================
    # 10) PROCESAR FILAS
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
            # BUSCAR EXISTENTE EN MEMORIA
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

                # Lo guardamos también en el diccionario
                # para evitar duplicados dentro del propio Excel.
                existentes_por_id[idexp] = exp

                nuevos_en_batch.append(exp)

                creados += 1

            # ==================================================
            # ACTUALIZAR
            # ==================================================

            else:

                actualizados += 1

            # ==================================================
            # FECHAS
            # ==================================================

            exp.fecha_alta = row.get("FECHAALTA")

            exp.fecha_firma = row.get("FECHAFIRMA")
            exp.fecha_inscripcion = row.get("FECHAINSCRIPCION")
            exp.fecha_entregado_cliente = (
                row.get("FECHAENTREGADOCLIENTE")
            )
            exp.fecha_prevista_firma = (
                row.get("FECHAPREVISTAFIRMA")
            )
            exp.fecha_vencimiento = (
                row.get("FECHAVENCIMIENTO")
            )
            exp.fecha_sol_cgn = (
                row.get("FECHASOLCGN")
            )
            exp.fecha_firma_prev_val = (
                row.get("FECHAFIRMAPPREVVAL")
            )
            exp.fecha_firma_prev_cli = (
                row.get("FECHAFIRMAPREVCLI")
            )

            # ==================================================
            # ESTADOS
            # ==================================================

            exp.estado_expediente = (
                row.get("ESTADOEXPEDIENTE")
                or row.get("ESTADO_EXPEDIENTE")
            )

            exp.estado_expediente_ancert = (
                row.get("ESTADOEXPEDIENTEANCERT")
                or row.get("ESTADO_EXPEDIENTE_ANCERT")
            )

            # ==================================================
            # ACTIVIDAD
            # ==================================================

            exp.actividad_actual = (
                row.get("ACTIVIDADACTUAL")
                or row.get("ACTIVIDAD_ACTUAL")
            )

            exp.estado_actividad = (
                row.get("ESTADOACTIVIDAD")
                or row.get("ESTADO_ACTIVIDAD")
            )

            exp.fecha_inicio_actividad = (
                row.get("FECHAINICIOACTIVIDAD")
            )

            exp.fecha_fin_actividad = (
                row.get("FECHAFINACTIVIDAD")
            )

            # ==================================================
            # TITULAR
            # ==================================================

            exp.nombre_titular = (
                row.get("NOMBRETITULAR")
                or row.get("NOMBRE_TITULAR")
            )

            exp.nif_titular = (
                row.get("NIFTITULAR")
                or row.get("NIF_TITULAR")
            )

            # ==================================================
            # NOTARIO
            # ==================================================

            exp.nombre_notario = (
                row.get("NOMBRENOTARIO")
                or row.get("NOMBRE_NOTARIO")
            )

            exp.nif_notario = (
                row.get("NIFNOTARIO")
                or row.get("NIF_NOTARIO")
            )

            exp.notario = (
                row.get("NOTARIO")
                or row.get("NOMBRENOTARIO")
            )

            # ==================================================
            # OFICINA
            # ==================================================

            exp.oficina = row.get("OFICINA")
            exp.oficina_alta = row.get("OFICINAALTA")
            exp.dan = row.get("DAN")

            # ==================================================
            # ECONÓMICOS
            # ==================================================

            exp.capital = row.get("CAPITAL")
            exp.importe = row.get("IMPORTE")
            exp.saldo_real = row.get("SALDOREAL")
            exp.saldo_disponible = row.get("SALDODISPONIBLE")

            # ==================================================
            # OPERACIÓN
            # ==================================================

            exp.contrato = row.get("CONTRATO")

            exp.num_solicitud_sia = (
                row.get("NUMSOLICITUDSIA")
                or row.get("NUM_SOLICITUD_SIA")
            )

            exp.tipo_operacion = (
                row.get("TIPOOPERACION")
                or row.get("TIPO_OPERACION")
            )

            exp.subtipo_operacion = (
                row.get("SUBTIPOOPERACION")
                or row.get("SUBTIPO_OPERACION")
            )

            exp.vinccanc = row.get("VINCCANC")
            exp.protocolo = row.get("PROTOCOLO")

            # ==================================================
            # GTG / BANKIA
            # ==================================================

            exp.origen_bankia = row.get("ORIGENBANKIA")

            exp.producto_gtg = (
                row.get("PRODUCTOGTG")
                or row.get("PRODUCTO_GTG")
            )

            exp.dt = row.get("DT")

            # ==================================================
            # GESTORÍA
            # ==================================================

            exp.gestoria = row.get("GESTORIA")

            # ==================================================
            # CGN
            # ==================================================

            exp.id_expediente_cgn = (
                row.get("IDEXPEDIENTECGN")
                or row.get("ID_EXPEDIENTE_CGN")
            )

            # ==================================================
            # OTROS
            # ==================================================

            exp.lucy = row.get("LUCY")
            exp.indicador_tt = row.get("INDICADORTT")

            # ==================================================
            # OBSERVACIONES
            # ==================================================

            exp.observaciones = row.get("OBSERVACIONES")

            # ==================================================
            # CONTADOR
            # ==================================================

            procesados += 1

            # ==================================================
            # LOG DE PROGRESO
            # ==================================================

            if procesados % 100 == 0:

                print(
                    f"PROGRESO: {procesados}/{total_filtrados} "
                    f"| creados={creados} "
                    f"| actualizados={actualizados}",
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

                # Limpiamos la lista de nuevos objetos.
                nuevos_en_batch = []

        except Exception as e:

            errores += 1

            print(
                f"ERROR PROCESANDO EXPEDIENTE "
                f"{idexp}: {e}",
                flush=True
            )

            # Expulsamos cualquier estado pendiente
            # de la sesión antes de continuar.
            db.rollback()

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

