import io
from datetime import date, datetime
from typing import Any

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

def limpiar_valor(valor: Any):
    """
    Convierte valores de pandas/numpy a valores normales de Python.

    Evita guardar:
    - NaN
    - NaT
    - Timestamp de pandas

    en la base de datos.
    """

    if pd.isna(valor):
        return None

    if isinstance(valor, pd.Timestamp):
        return valor.to_pydatetime()

    return valor


def limpiar_texto(valor: Any):
    """
    Convierte un valor a texto limpio.
    """

    valor = limpiar_valor(valor)

    if valor is None:
        return None

    texto = str(valor).strip()

    if texto == "":
        return None

    return texto


def obtener_valor(row, *columnas):
    """
    Devuelve el primer valor válido encontrado entre
    varias columnas posibles.
    """

    for columna in columnas:

        if columna not in row.index:
            continue

        valor = limpiar_valor(row[columna])

        if valor is not None:

            if isinstance(valor, str):

                valor = valor.strip()

                if valor == "":
                    continue

            return valor

    return None


def convertir_fecha(valor):
    """
    Convierte cualquier fecha procedente del Excel
    a datetime/date compatible con SQLAlchemy.

    Acepta formatos como:

        08/11/2025
        08/11/2025 00:00:00
        2025-11-08
        Timestamp de pandas
    """

    valor = limpiar_valor(valor)

    if valor is None:
        return None

    if isinstance(valor, datetime):
        return valor

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

        return fecha.to_pydatetime()

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

    El Excel contiene aproximadamente:

        110.000+ filas
        55 columnas
        ~29 MB

    El proceso:

    1. Lee el Excel.
    2. Comprueba las columnas.
    3. Convierte FECHAALTA correctamente.
    4. Filtra EXCLUSIVAMENTE la fecha solicitada.
    5. Solo procesa esas filas.
    6. Crea o actualiza los expedientes.
    7. Hace commits por lotes.

    Ejemplo:

        fecha_objetivo = 2025-11-08

    Solo se procesan:

        FECHAALTA = 08/11/2025
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
    # 2) LEER EXCEL
    # ========================================================

    print(
        "IMPORTADOR: leyendo Excel con pandas...",
        flush=True
    )

    try:

        df = pd.read_excel(
            io.BytesIO(contenido_excel),
            sheet_name=0,
            header=0,
            engine="openpyxl"
        )

    except Exception as e:

        print(
            f"ERROR LEYENDO EXCEL: {e}",
            flush=True
        )

        raise ValueError(
            f"No se pudo leer el Excel: {e}"
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
    # 3) NORMALIZAR NOMBRES DE COLUMNAS
    # ========================================================

    df.columns = [
        str(col).strip().upper()
        for col in df.columns
    ]

    print(
        f"COLUMNAS NORMALIZADAS: {list(df.columns)}",
        flush=True
    )

    # ========================================================
    # 4) COMPROBAR COLUMNAS OBLIGATORIAS
    # ========================================================

    if "FECHAALTA" not in df.columns:

        print(
            "ERROR: NO EXISTE FECHAALTA",
            flush=True
        )

        raise ValueError(
            "El Excel no contiene la columna FECHAALTA."
        )

    if "IDEXPEDIENTE" not in df.columns:

        print(
            "ERROR: NO EXISTE IDEXPEDIENTE",
            flush=True
        )

        raise ValueError(
            "El Excel no contiene la columna IDEXPEDIENTE."
        )

    print(
        "IMPORTADOR: columnas obligatorias encontradas.",
        flush=True
    )

    # ========================================================
    # 5) CONVERTIR FECHAALTA
    # ========================================================

    print(
        "IMPORTADOR: convirtiendo FECHAALTA...",
        flush=True
    )

    df["FECHAALTA"] = pd.to_datetime(
        df["FECHAALTA"],
        dayfirst=True,
        errors="coerce"
    )

    # ========================================================
    # 6) MOSTRAR INFORMACIÓN DE FECHAS
    # ========================================================

    fechas_validas = df["FECHAALTA"].notna().sum()

    print(
        f"FECHAS VÁLIDAS EN EXCEL: {fechas_validas}",
        flush=True
    )

    print(
        f"FECHAS INVÁLIDAS/VACÍAS: "
        f"{len(df) - fechas_validas}",
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
        f"IMPORTADOR: filtrando por fecha "
        f"{fecha_objetivo}...",
        flush=True
    )

    fecha_timestamp = pd.Timestamp(fecha_objetivo)

    df_filtrado = df[
        df["FECHAALTA"].dt.normalize() == fecha_timestamp
    ].copy()

    total_filtrados = len(df_filtrado)

    print(
        f"FILAS ENCONTRADAS PARA "
        f"{fecha_objetivo}: {total_filtrados}",
        flush=True
    )

    # ========================================================
    # 8) MOSTRAR PRIMEROS IDS ENCONTRADOS
    # ========================================================

    if total_filtrados > 0:

        print(
            "PRIMEROS EXPEDIENTES ENCONTRADOS:",
            flush=True
        )

        primeros = (
            df_filtrado["IDEXPEDIENTE"]
            .head(10)
            .tolist()
        )

        for idexp in primeros:

            print(
                f"  -> {idexp}",
                flush=True
            )

    # ========================================================
    # 9) SI NO HAY DATOS
    # ========================================================

    if total_filtrados == 0:

        print(
            "IMPORTADOR: no existen altas para "
            f"{fecha_objetivo}.",
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
    # 10) LIMPIAR IDEXPEDIENTE
    # ========================================================

    df_filtrado["IDEXPEDIENTE"] = (
        df_filtrado["IDEXPEDIENTE"]
        .apply(limpiar_texto)
    )

    # Eliminar filas sin expediente
    df_filtrado = df_filtrado[
        df_filtrado["IDEXPEDIENTE"].notna()
    ].copy()

    df_filtrado = df_filtrado[
        df_filtrado["IDEXPEDIENTE"] != ""
    ].copy()

    total_filtrados = len(df_filtrado)

    print(
        f"EXPEDIENTES CON ID VÁLIDO: "
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
    # 11) IDS ÚNICOS
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
    # 12) BUSCAR EXISTENTES
    # ========================================================

    print(
        "IMPORTADOR: buscando expedientes existentes...",
        flush=True
    )

    existentes_por_id = {}

    # Lo hacemos por bloques para no construir una consulta
    # gigantesca si algún día hay muchas altas.

    for inicio in range(0, len(ids_excel), BATCH_SIZE):

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
                str(exp.id_expediente).strip()
            ] = exp

    print(
        f"EXPEDIENTES YA EXISTENTES: "
        f"{len(existentes_por_id)}",
        flush=True
    )

    # ========================================================
    # 13) CONTADORES
    # ========================================================

    creados = 0
    actualizados = 0
    errores = 0
    procesados = 0

    # ========================================================
    # 14) PROCESAMIENTO
    # ========================================================

    print(
        "IMPORTADOR: comenzando procesamiento "
        "de las altas filtradas...",
        flush=True
    )

    for _, row in df_filtrado.iterrows():

        idexp = limpiar_texto(
            row.get("IDEXPEDIENTE")
        )

        if not idexp:
            continue

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

            exp.fecha_inicio_actividad = convertir_fecha(
                row.get("FECHAINICIOACTIVIDAD")
            )

            exp.fecha_fin_actividad = convertir_fecha(
                row.get("FECHAFINACTIVIDAD")
            )

            # ==================================================
            # ESTADOS
            # ==================================================

            exp.estado_expediente = obtener_valor(
                row,
                "ESTADOEXPEDIENTE",
                "ESTADO_EXPEDIENTE"
            )

            exp.estado_expediente_ancert = obtener_valor(
                row,
                "ESTADOEXPEDIENTEANCERT",
                "ESTADO_EXPEDIENTE_ANCERT"
            )

            # ==================================================
            # ACTIVIDAD
            # ==================================================

            exp.actividad_actual = obtener_valor(
                row,
                "ACTIVIDADACTUAL",
                "ACTIVIDAD_ACTUAL"
            )

            exp.estado_actividad = obtener_valor(
                row,
                "ESTADOACTIVIDAD",
                "ESTADO_ACTIVIDAD"
            )

            # ==================================================
            # TITULAR
            # ==================================================

            exp.nombre_titular = obtener_valor(
                row,
                "NOMBRETITULAR",
                "NOMBRE_TITULAR"
            )

            exp.nif_titular = obtener_valor(
                row,
                "NIFTITULAR",
                "NIF_TITULAR"
            )

            # ==================================================
            # NOTARIO
            # ==================================================

            exp.nombre_notario = obtener_valor(
                row,
                "NOMBRENOTARIO",
                "NOMBRE_NOTARIO"
            )

            exp.nif_notario = obtener_valor(
                row,
                "NIFNOTARIO",
                "NIF_NOTARIO"
            )

            exp.notario = obtener_valor(
                row,
                "NOTARIO",
                "NOMBRENOTARIO"
            )

            # ==================================================
            # OFICINA
            # ==================================================

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

            # ==================================================
            # ECONÓMICOS
            # ==================================================

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

            # ==================================================
            # OPERACIÓN
            # ==================================================

            exp.contrato = obtener_valor(
                row,
                "CONTRATO"
            )

            exp.num_solicitud_sia = obtener_valor(
                row,
                "NUMSOLICITUDSIA",
                "NUM_SOLICITUD_SIA"
            )

            exp.tipo_operacion = obtener_valor(
                row,
                "TIPOOPERACION",
                "TIPO_OPERACION"
            )

            exp.subtipo_operacion = obtener_valor(
                row,
                "SUBTIPOOPERACION",
                "SUBTIPO_OPERACION"
            )

            exp.vinccanc = obtener_valor(
                row,
                "VINCCANC"
            )

            exp.protocolo = obtener_valor(
                row,
                "PROTOCOLO"
            )

            # ==================================================
            # GTG / BANKIA
            # ==================================================

            exp.origen_bankia = obtener_valor(
                row,
                "ORIGENBANKIA"
            )

            exp.producto_gtg = obtener_valor(
                row,
                "PRODUCTOGTG",
                "PRODUCTO_GTG"
            )

            exp.dt = obtener_valor(
                row,
                "DT"
            )

            # ==================================================
            # GESTORÍA
            # ==================================================

            exp.gestoria = obtener_valor(
                row,
                "GESTORIA",
                "NOMBREGESTORIA"
            )

            # ==================================================
            # CGN
            # ==================================================

            exp.id_expediente_cgn = obtener_valor(
                row,
                "IDEXPEDIENTECGN",
                "ID_EXPEDIENTE_CGN"
            )

            # ==================================================
            # OTROS
            # ==================================================

            exp.lucy = obtener_valor(
                row,
                "LUCY"
            )

            exp.indicador_tt = obtener_valor(
                row,
                "INDICADORTT"
            )

            # ==================================================
            # OBSERVACIONES
            # ==================================================

            exp.observaciones = obtener_valor(
                row,
                "OBSERVACIONES"
            )

            # ==================================================
            # CONTADOR
            # ==================================================

            procesados += 1

            # ==================================================
            # PROGRESO
            # ==================================================

            if procesados % 25 == 0:

                print(
                    f"PROGRESO: {procesados}/"
                    f"{total_filtrados} "
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

            # Si hacemos rollback, los objetos nuevos pendientes
            # pueden dejar de estar en la sesión. Volvemos a
            # reconstruir el mapa de existentes para continuar.

            existentes_db = (
                db.query(Expediente)
                .filter(
                    Expediente.id_expediente.in_(
                        list(existentes_por_id.keys())
                    )
                )
                .all()
            )

            existentes_por_id = {
                str(exp.id_expediente).strip(): exp
                for exp in existentes_db
            }

    # ========================================================
    # 15) COMMIT FINAL
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
    # 16) RESULTADO
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
        f"FILAS ENCONTRADAS: {total_filtrados}",
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
        "total_filtrados": total_filtrados,
        "total_procesados": procesados
    }
