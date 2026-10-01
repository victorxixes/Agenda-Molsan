import io
import re
import unicodedata
from datetime import date, datetime
from decimal import Decimal
from typing import Any

import pandas as pd
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente


BATCH_SIZE = 500


def normalizar_columna(valor: Any) -> str:
    texto = "" if valor is None else str(valor)
    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    texto = texto.upper().strip()
    return re.sub(r"[^A-Z0-9]+", "", texto)


def limpiar_valor(valor: Any):
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
    valor = limpiar_valor(valor)
    if valor is None:
        return None
    texto = str(valor).strip()
    return texto or None


def obtener_valor(row, *columnas):
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
    valor = limpiar_valor(valor)
    if valor is None:
        return None
    if isinstance(valor, datetime):
        return valor.date()
    if isinstance(valor, date):
        return valor
    try:
        fecha = pd.to_datetime(valor, dayfirst=True, errors="coerce")
        return None if pd.isna(fecha) else fecha.date()
    except Exception:
        return None


def convertir_numero(valor):
    valor = limpiar_valor(valor)
    if valor is None:
        return None
    if isinstance(valor, bool):
        return float(valor)
    if isinstance(valor, (int, float, Decimal)):
        try:
            return float(valor)
        except (TypeError, ValueError):
            return None

    texto = str(valor).strip()
    if not texto:
        return None

    if "," in texto:
        texto = texto.replace(".", "").replace(",", ".")
    else:
        texto = texto.replace(" ", "")

    try:
        return float(texto)
    except (TypeError, ValueError):
        return None


def asignar_si_existe(objeto, valor, *atributos):
    """
    Escribe únicamente en atributos que existan en el modelo.
    Permite compatibilidad entre nombres antiguos/nuevos.
    """
    if valor is None:
        return False

    for atributo in atributos:
        if hasattr(objeto, atributo):
            setattr(objeto, atributo, valor)
            return True
    return False


# Excel -> posibles atributos del modelo
TEXTOS = {
    "ESTADOEXPEDIENTE": ("estado_expediente",),
    "ESTADOEXPEDIENTEANCERT": ("estado_expediente_ancert",),
    "ESTADOACTIVIDAD": ("estado_actividad",),
    "NOMBRETITULAR": ("nombre_titular",),
    "NIFTITULAR": ("nif_titular",),
    "NOMBRESOLICITANTE": ("nombresolicitante", "nombre_solicitante"),
    "NIFSOLICITANTE": ("nifsolicitante", "nif_solicitante"),
    "APODERADO": ("apoderado",),
    "NOMBRENOTARIO": ("nombre_notario",),
    "NIFNOTARIO": ("nif_notario",),
    "NOTARIO": ("notario",),
    "OFICINA": ("oficina",),
    "OFICINAALTA": ("oficina_alta",),
    "DAN": ("dan",),
    "ACTIVIDADACTUAL": ("actividad_actual",),
    "IDPROVISION": ("id_provision",),
    "TIPOPROVISION": ("tipo_provision",),
    "CONTRATO": ("contrato",),
    "NUMSOLICITUDSIA": ("num_solicitud_sia",),
    "NSOLICITUDSIA": ("num_solicitud_sia",),
    "TIPOOPERACION": ("tipo_operacion",),
    "SUBTIPOOPERACION": ("subtipo_operacion",),
    "VINCCANC": ("vinccanc",),
    "PROTOCOLO": ("protocolo",),
    "ORIGENBANKIA": ("origen_bankia",),
    "PRODUCTOGTG": ("producto_gtg",),
    "DT": ("dt",),
    "IDGESTORIATRAMITE": ("id_gestoria_tramite",),
    "NOMBREGESTORIA": ("nombre_gestoria", "gestoria"),
    "GESTORIA": ("gestoria",),
    "FINCA": ("finca",),
    "TIENEDEFECTOSABIERTOS": ("tiene_defectos_abiertos",),
    "TIPOERROR": ("tipo_error",),
    "DESCRIPCIONERROR": ("descripcion_error",),
    "FALTADEFECTO": ("falta_defecto",),
    "IDEXPEDIENTECGN": ("id_expediente_cgn",),
    "TIPOACTA": ("tipo_acta",),
    "LUCY": ("lucy",),
    "INDICADORTT": ("indicador_tt",),
    "OBSERVACIONES": ("observaciones",),
    "FACTURACIONESTADO": ("facturacion_estado",),
    "ESTADOFACTURACION": ("facturacion_estado",),
    "REGISTRALESTADO": ("registral_estado",),
    "ESTADOREGISTRAL": ("registral_estado",),
}

FECHAS = {
    "FECHAALTA": ("fecha_alta",),
    "FECHAFIRMA": ("fecha_firma",),
    "FECHAINSCRIPCION": ("fecha_inscripcion",),
    "FECHAENTREGADOCLIENTE": ("fecha_entregado_cliente",),
    "FECHAPREVISTAFIRMA": ("fecha_prevista_firma",),
    "FECHAVENCIMIENTO": ("fecha_vencimiento",),
    "FECHASOLCGN": ("fecha_sol_cgn",),
    "FECHAFIRMAPREVVAL": ("fecha_firma_prev_val",),
    "FECHAFIRMAPREVCLI": ("fecha_firma_prev_cli",),
    "FECHAINICIOACTIVIDAD": ("fecha_inicio_actividad",),
    "FECHAFINACTIVIDAD": ("fecha_fin_actividad",),
    "FCIERREDEFECTO": ("fcierre_defecto", "fecha_cierre_defecto"),
    "FECHACIERREDEFECTO": ("fcierre_defecto", "fecha_cierre_defecto"),
    "FACTURACIONFECHA": ("facturacion_fecha",),
    "FECHAFACTURACION": ("facturacion_fecha",),
    "REGISTRALFECHA": ("registral_fecha",),
    "FECHAREGISTRAL": ("registral_fecha",),
}

NUMEROS = {
    "CLIENTEID": ("cliente_id",),
    "IDCLIENTE": ("cliente_id",),
    "CAPITAL": ("capital",),
    "IMPORTE": ("importe",),
    "SALDOREAL": ("saldo_real",),
    "SALDODISPONIBLE": ("saldo_disponible",),
}


def aplicar_mapeo(row, expediente):
    asignados = 0

    for columna, atributos in TEXTOS.items():
        valor = obtener_valor(row, columna)
        if valor is not None and asignar_si_existe(
            expediente, limpiar_texto(valor), *atributos
        ):
            asignados += 1

    for columna, atributos in FECHAS.items():
        valor = convertir_fecha(obtener_valor(row, columna))
        if valor is not None and asignar_si_existe(
            expediente, valor, *atributos
        ):
            asignados += 1

    for columna, atributos in NUMEROS.items():
        valor = convertir_numero(obtener_valor(row, columna))
        if valor is not None and asignar_si_existe(
            expediente, valor, *atributos
        ):
            asignados += 1

    return asignados


def importar_excel_expedientes(
    db: Session,
    contenido_excel: bytes,
    fecha_objetivo: date = None,
):
    """
    Importa la matriz ABSIS.

    Importante:
    - Filtra por FECHAALTA.
    - Hace upsert por IDEXPEDIENTE.
    - No duplica expedientes.
    - Importa también facturación y registral.
    - Un error de una fila no revierte las filas anteriores del lote.
    """
    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - INICIO", flush=True)

    if fecha_objetivo is None:
        fecha_objetivo = date.today()

    if not contenido_excel:
        raise ValueError("El fichero Excel está vacío.")

    print(f"FECHA OBJETIVO: {fecha_objetivo}", flush=True)
    print(f"TAMAÑO DEL FICHERO: {len(contenido_excel)} bytes", flush=True)

    try:
        df = pd.read_excel(
            io.BytesIO(contenido_excel),
            sheet_name=0,
            header=0,
            engine="openpyxl",
        )
    except Exception as e:
        raise ValueError(f"No se pudo leer el Excel: {e}") from e

    print(f"TOTAL FILAS EXCEL: {len(df)}", flush=True)
    print(f"TOTAL COLUMNAS EXCEL: {len(df.columns)}", flush=True)

    df.columns = [normalizar_columna(c) for c in df.columns]

    if len(df.columns) != len(set(df.columns)):
        duplicadas = sorted(
            {c for c in df.columns if list(df.columns).count(c) > 1}
        )
        raise ValueError(
            "El Excel contiene columnas duplicadas después de "
            f"normalizarlas: {duplicadas}"
        )

    print(f"COLUMNAS NORMALIZADAS: {list(df.columns)}", flush=True)

    if "FECHAALTA" not in df.columns:
        raise ValueError("El Excel no contiene la columna FECHAALTA.")

    if "IDEXPEDIENTE" not in df.columns:
        raise ValueError("El Excel no contiene la columna IDEXPEDIENTE.")

    df["FECHAALTA"] = pd.to_datetime(
        df["FECHAALTA"],
        dayfirst=True,
        errors="coerce",
    )

    fecha_timestamp = pd.Timestamp(fecha_objetivo)

    df = df[
        df["FECHAALTA"].dt.normalize() == fecha_timestamp.normalize()
    ].copy()

    print(
        f"FILAS ENCONTRADAS PARA {fecha_objetivo}: {len(df)}",
        flush=True,
    )

    if df.empty:
        return {
            "creados": 0,
            "actualizados": 0,
            "errores": 0,
            "fecha_importada": fecha_objetivo.isoformat(),
            "total_filtrados": 0,
            "total_procesados": 0,
        }

    df["IDEXPEDIENTE"] = df["IDEXPEDIENTE"].apply(limpiar_texto)
    df = df[df["IDEXPEDIENTE"].notna()].copy()
    df = df[df["IDEXPEDIENTE"] != ""].copy()

    # Un mismo expediente puede aparecer varias veces en el Excel.
    # Conservamos la última fila.
    df = df.drop_duplicates(
        subset=["IDEXPEDIENTE"],
        keep="last",
    ).copy()

    total_filtrados = len(df)

    ids_excel = df["IDEXPEDIENTE"].tolist()
    existentes_por_id = {}

    for inicio in range(0, len(ids_excel), BATCH_SIZE):
        bloque = ids_excel[inicio:inicio + BATCH_SIZE]

        existentes = (
            db.query(Expediente)
            .filter(Expediente.id_expediente.in_(bloque))
            .all()
        )

        for exp in existentes:
            existentes_por_id[str(exp.id_expediente).strip()] = exp

    print(
        f"EXPEDIENTES YA EXISTENTES: {len(existentes_por_id)}",
        flush=True,
    )

    creados = 0
    actualizados = 0
    errores = 0
    procesados = 0

    for _, row in df.iterrows():
        idexp = limpiar_texto(row.get("IDEXPEDIENTE"))

        if not idexp:
            continue

        try:
            # SAVEPOINT por expediente:
            # un fallo no provoca rollback del lote completo.
            with db.begin_nested():
                exp = existentes_por_id.get(idexp)
                es_nuevo = exp is None

                if es_nuevo:
                    exp = Expediente(id_expediente=idexp)
                    db.add(exp)

                aplicar_mapeo(row, exp)

                # Valida INSERT/UPDATE dentro del SAVEPOINT.
                db.flush()

            if es_nuevo:
                existentes_por_id[idexp] = exp
                creados += 1
            else:
                actualizados += 1

            procesados += 1

            if procesados % 25 == 0:
                print(
                    f"PROGRESO: {procesados}/{total_filtrados} "
                    f"| creados={creados} "
                    f"| actualizados={actualizados} "
                    f"| errores={errores}",
                    flush=True,
                )

            if procesados % BATCH_SIZE == 0:
                print(
                    f"IMPORTADOR: guardando lote "
                    f"{procesados // BATCH_SIZE}...",
                    flush=True,
                )
                db.commit()

        except Exception as e:
            errores += 1
            print(
                f"ERROR PROCESANDO EXPEDIENTE {idexp}: {e}",
                flush=True,
            )
            # NO hacer db.rollback() aquí:
            # el SAVEPOINT ya ha revertido únicamente esta fila.

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"ERROR EN COMMIT FINAL: {e}", flush=True)
        raise

    print("============================================", flush=True)
    print("IMPORTADOR ABSIS - FINALIZADO", flush=True)
    print(f"FECHA: {fecha_objetivo}", flush=True)
    print(f"FILAS ENCONTRADAS: {total_filtrados}", flush=True)
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
        "total_procesados": procesados,
    }
