```python
import pandas as pd
import io
from datetime import date
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente
from backend.app.expedientes.detalle.models import ExpedienteDetalle


# ============================================================
# CONFIGURACIÓN
# ============================================================

# Número de expedientes que se procesan antes de hacer commit.
# Esto evita mantener una transacción gigantesca.
BATCH_SIZE = 500


def importar_excel_expedientes(
    db: Session,
    contenido_excel: bytes,
    fecha_objetivo: date = None
):
    """
    Importa expedientes desde el Excel matriz ABSIS.

    IMPORTANTE:
    El Excel puede contener un histórico muy grande.
    Solo se importan las filas cuya FECHAALTA coincide
    con fecha_objetivo.

    Si fecha_objetivo no se indica, se utiliza la fecha actual.
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
    # 1) LEER EXCEL DESDE BYTES
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
        "IMPORTADOR: Excel leído correctamente",
        flush=True
    )

    print(
        "COLUMNAS:",
        list(df.columns),
        flush=True
    )

    print(
        "TOTAL FILAS EXCEL:",
        len(df),
        flush=True
    )

    # ========================================================
    # 2) COMPROBAR COLUMNA FECHAALTA
    # ========================================================

    if "FECHAALTA" not in df.columns:
        raise ValueError(
            "El Excel no contiene la columna FECHAALTA"
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

    fechas_validas = df["FECHAALTA"].notna().sum()

    print(
        f"FECHAS VÁLIDAS: {fechas_validas}",
        flush=True
    )

    # ========================================================
    # 4) FILTRAR POR FECHA OBJETIVO
    # ========================================================

    print(
        f"IMPORTADOR: filtrando por {fecha_objetivo}...",
        flush=True
    )

    df_filtrado = df[
        df["FECHAALTA"] == fecha_objetivo
    ].copy()

    total_filtrados = len(df_filtrado)

    print(
        f"FILAS FILTRADAS: {total_filtrados}",
        flush=True
    )

    # ========================================================
    # SI NO HAY EXPEDIENTES
    # ========================================================

    if total_filtrados == 0:
        print(
            "IMPORTADOR: no existen expedientes para la fecha indicada.",
            flush=True
        )

        return {
            "creados": 0,
            "actualizados": 0,
            "fecha_importada": fecha_objetivo.isoformat(),
            "total_filtrados": 0
        }

    # ========================================================
    # 5) CONTADORES
    # ========================================================

    creados = 0
    actualizados = 0
    errores = 0

    detalles_batch = []

    procesados = 0

    # ========================================================
    # 6) RECORRER SOLO LAS FILAS DE LA FECHA
    # ========================================================

    print(
        "IMPORTADOR: comenzando procesamiento...",
        flush=True
    )

    for _, row in df_filtrado.iterrows():

        try:

            # ------------------------------------------------
            # IDENTIFICADOR DEL EXPEDIENTE
            # ------------------------------------------------

            idexp = row.get("IDEXPEDIENTE")

            if pd.isna(idexp) or not str(idexp).strip():
                print(
                    "AVISO: fila sin IDEXPEDIENTE. Se omite.",
                    flush=True
                )
                continue

            idexp = str(idexp).strip()

            # ------------------------------------------------
            # BUSCAR EXPEDIENTE EXISTENTE
            # ------------------------------------------------

            exp = (
                db.query(Expediente)
                .filter(
                    Expediente.id_expediente == idexp
                )
                .first()
            )

            # ------------------------------------------------
            # CREAR / ACTUALIZAR
            # ------------------------------------------------

            if not exp:

                exp = Expediente(
                    id_expediente=idexp
                )

                db.add(exp)

                creados += 1

            else:

                actualizados += 1

            # ------------------------------------------------
            # DATOS PRINCIPALES
            # ------------------------------------------------

            exp.fecha_alta = row.get("FECHAALTA")

            exp.estado_expediente = (
                row.get("ESTADOEXPEDIENTE")
                or row.get("ESTADO_EXPEDIENTE")
            )

            exp.estado_expediente_ancert = (
                row.get("ESTADOEXPEDIENTEANCERT")
                or row.get("ESTADO_EXPEDIENTE_ANCERT")
            )

            exp.actividad_actual = (
                row.get("ACTIVIDADACTUAL")
                or row.get("ACTIVIDAD_ACTUAL")
            )

            exp.estado_actividad = (
                row.get("ESTADOACTIVIDAD")
                or row.get("ESTADO_ACTIVIDAD")
            )

            # ------------------------------------------------
            # TITULAR
            # ------------------------------------------------

            exp.nombre_titular = (
                row.get("NOMBRETITULAR")
                or row.get("NOMBRE_TITULAR")
            )

            exp.nif_titular = (
                row.get("NIFTITULAR")
                or row.get("NIF_TITULAR")
            )

            # ------------------------------------------------
            # NOTARIO
            # ------------------------------------------------

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

            # ------------------------------------------------
            # OFICINA
            # ------------------------------------------------

            exp.oficina = row.get("OFICINA")
            exp.oficina_alta = row.get("OFICINAALTA")
            exp.dan = row.get("DAN")

            # ------------------------------------------------
            # ECONÓMICOS
            # ------------------------------------------------

            exp.capital = row.get("CAPITAL")
            exp.importe = row.get("IMPORTE")
            exp.saldo_real = row.get("SALDOREAL")
            exp.saldo_disponible = row.get("SALDODISPONIBLE")

            # ------------------------------------------------
            # OPERACIÓN
            # ------------------------------------------------

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

            # ------------------------------------------------
            # GTG / BANKIA
            # ------------------------------------------------

            exp.origen_bankia = row.get("ORIGENBANKIA")

            exp.producto_gtg = (
                row.get("PRODUCTOGTG")
                or row.get("PRODUCTO_GTG")
            )

            exp.dt = row.get("DT")

            # ------------------------------------------------
            # GESTORÍA
            # ------------------------------------------------

            exp.gestoria = row.get("GESTORIA")

            # ------------------------------------------------
            # CGN
            # ------------------------------------------------

            exp.id_expediente_cgn = (
                row.get("IDEXPEDIENTECGN")
                or row.get("ID_EXPEDIENTE_CGN")
            )

            # ------------------------------------------------
            # OTROS
            # ------------------------------------------------

            exp.lucy = row.get("LUCY")
            exp.indicador_tt = row.get("INDICADORTT")

            # ------------------------------------------------
            # OBSERVACIONES
            # ------------------------------------------------

            exp.observaciones = row.get("OBSERVACIONES")

            # ------------------------------------------------
            # DETALLES
            # ------------------------------------------------

            # El ID de la fila principal puede necesitar estar
            # disponible antes de crear ExpedienteDetalle.
            #
            # Por eso hacemos flush únicamente cuando se trata
            # de un expediente nuevo y necesitamos su ID.
            #
            # No hacemos flush para cada expediente antiguo.

            if exp.id is None:
                db.flush()

            for col in df.columns:

                valor = row.get(col)

                if pd.isna(valor):
                    valor = ""

                detalles_batch.append(
                    ExpedienteDetalle(
                        expediente_id=exp.id,
                        campo=str(col),
                        valor=str(valor)
                    )
                )

            procesados += 1

            # ------------------------------------------------
            # PROGRESO
            # ------------------------------------------------

            if procesados % 100 == 0:

                print(
                    f"PROGRESO: {procesados}/{total_filtrados} "
                    f"| creados={creados} "
                    f"| actualizados={actualizados}",
                    flush=True
                )

            # ------------------------------------------------
            # COMMIT POR LOTES
            # ------------------------------------------------

            if procesados % BATCH_SIZE == 0:

                print(
                    f"IMPORTADOR: commit lote "
                    f"{procesados // BATCH_SIZE}",
                    flush=True
                )

                if detalles_batch:
                    db.bulk_save_objects(
                        detalles_batch
                    )

                    detalles_batch = []

                db.commit()

        except Exception as e:

            errores += 1

            print(
                f"ERROR PROCESANDO EXPEDIENTE "
                f"{idexp if 'idexp' in locals() else 'DESCONOCIDO'}: {e}",
                flush=True
            )

            db.rollback()

    # ========================================================
    # 7) GUARDAR ÚLTIMO LOTE DE DETALLES
    # ========================================================

    if detalles_batch:

        print(
            "IMPORTADOR: guardando último lote de detalles...",
            flush=True
        )

        db.bulk_save_objects(
            detalles_batch
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
```

### `backend/app/Utilidades/importadores/router_absis.py`

```python
from fastapi import APIRouter, UploadFile, File, Query, Depends
from sqlalchemy.orm import Session
from datetime import date, datetime

from backend.app.database import get_db
from backend.app.Utilidades.importadores.expedientes_importer import (
    importar_excel_expedientes
)


router = APIRouter(
    prefix="/utilidades/importador-absis",
    tags=["Importador ABSIS"]
)


@router.post("/expedientes")
async def importar_expedientes_absis(
    fichero: UploadFile = File(...),
    fecha: str | None = Query(
        None,
        description=(
            "Fecha a importar en formato YYYY-MM-DD. "
            "Si no se indica, se utiliza la fecha actual."
        )
    ),
    db: Session = Depends(get_db)
):
    """
    Importa expedientes del Excel matriz ABSIS.

    El Excel puede contener un histórico grande, pero el
    importador solamente procesa las filas cuya FECHAALTA
    coincide con la fecha seleccionada.

    Si no se indica fecha:
        se utiliza date.today().

    Si se indica fecha:
        debe tener formato YYYY-MM-DD.
    """

    print("============================================", flush=True)
    print("API IMPORTADOR ABSIS - INICIO", flush=True)
    print("============================================", flush=True)

    # ========================================================
    # 1) VALIDAR FICHERO
    # ========================================================

    if not fichero:
        return {
            "error": "No se ha recibido ningún fichero."
        }

    print(
        f"FICHERO: {fichero.filename}",
        flush=True
    )

    print(
        f"CONTENT TYPE: {fichero.content_type}",
        flush=True
    )

    # ========================================================
    # 2) LEER CONTENIDO DEL ARCHIVO
    # ========================================================

    print(
        "API: leyendo fichero...",
        flush=True
    )

    try:

        contenido = await fichero.read()

    except Exception as e:

        print(
            f"ERROR LEYENDO FICHERO: {e}",
            flush=True
        )

        return {
            "error": "No se pudo leer el fichero.",
            "detalle": str(e)
        }

    print(
        f"FICHERO LEÍDO: {len(contenido)} bytes",
        flush=True
    )

    # ========================================================
    # 3) DETERMINAR FECHA OBJETIVO
    # ========================================================

    if fecha:

        try:

            fecha_objetivo = datetime.strptime(
                fecha,
                "%Y-%m-%d"
            ).date()

        except ValueError:

            return {
                "error": (
                    "Formato de fecha inválido. "
                    "Usa YYYY-MM-DD."
                )
            }

    else:

        fecha_objetivo = date.today()

    print(
        f"FECHA OBJETIVO: {fecha_objetivo}",
        flush=True
    )

    # ========================================================
    # 4) EJECUTAR IMPORTADOR
    # ========================================================

    print(
        "API: iniciando importador...",
        flush=True
    )

    try:

        resultado = importar_excel_expedientes(
            db=db,
            contenido_excel=contenido,
            fecha_objetivo=fecha_objetivo
        )

    except ValueError as e:

        print(
            f"ERROR DE VALIDACIÓN EN IMPORTADOR: {e}",
            flush=True
        )

        db.rollback()

        return {
            "error": str(e)
        }

    except Exception as e:

        print(
            f"ERROR IMPORTANDO ABSIS: {e}",
            flush=True
        )

        db.rollback()

        return {
            "error": "Error durante la importación ABSIS.",
            "detalle": str(e)
        }

    # ========================================================
    # 5) RESPUESTA
    # ========================================================

    print(
        "API: importación finalizada.",
        flush=True
    )

    return {
        "mensaje": "Importación ABSIS completada",
        "fecha_importada": resultado["fecha_importada"],
        "expedientes_creados": resultado["creados"],
        "expedientes_actualizados": resultado["actualizados"],
        "total_filtrados": resultado["total_filtrados"],
        "total_procesados": resultado.get(
            "total_procesados",
            0
        ),
        "errores": resultado.get(
            "errores",
            0
        )
    }
```

### ⚠️ Una advertencia antes de pegarlo

Hay **un punto que quiero que comprobemos después**: estás creando `ExpedienteDetalle` para cada una de las 55 columnas. Con, por ejemplo, 2.000 expedientes de un día, eso serían unos **110.000 detalles por importación**. Puede ser correcto si necesitas conservar el contenido completo del Excel, pero si esos detalles no son necesarios, podemos hacer el importador muchísimo más rápido eliminándolos o guardándolos de otra forma.

Además, la versión que te he dado hace `flush()` solo cuando el expediente es nuevo para obtener `exp.id`, que es mucho mejor que hacerlo siempre, pero **todavía podemos optimizarlo más** una vez veamos `ExpedienteDetalle`.

**Mi recomendación ahora:** pega estos dos archivos, despliega en Render y prueba primero con una fecha que sepas que tiene pocos expedientes. Mira los logs: deberíamos empezar a ver `FILAS FILTRADAS: X` y, crucialmente, ya no debería intentar procesar las ~120.000 filas como expedientes.
