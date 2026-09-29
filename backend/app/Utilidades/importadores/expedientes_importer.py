import pandas as pd
import io
from datetime import date
from sqlalchemy.orm import Session
from backend.app.expedientes.models import Expediente
from backend.app.expedientes.detalle.models import ExpedienteDetalle

def importar_excel_expedientes(db: Session, contenido_excel: bytes, fecha_objetivo: date = None):

    # ============================
    # 0) LEER EXCEL DESDE BYTES
    # ============================
    try:
        df = pd.read_excel(io.BytesIO(contenido_excel))
    except Exception as e:
        print("ERROR LEYENDO EXCEL:", e)
        raise ValueError("No se pudo leer el archivo Excel. Formato inválido o archivo corrupto.")

    print("COLUMNAS:", df.columns)
    print("TOTAL FILAS EXCEL:", len(df))

    print(df.head(5))

    print("FILTRADOS:", len(df_filtrado))
    
    # ============================
    # 1) FECHA OBJETIVO
    # ============================
    if fecha_objetivo is None:
        fecha_objetivo = date.today()

    if "FECHAALTA" not in df.columns:
        raise ValueError("El Excel no contiene la columna FECHAALTA")

    df["FECHAALTA"] = pd.to_datetime(df["FECHAALTA"], errors="coerce").dt.date

    df_filtrado = df

    print("FILTRADOS:", len(df_filtrado))

    creados = 0
    actualizados = 0

    detalles_batch = []

    # ============================
    # 3) RECORRER FILAS (OPTIMIZADO)
    # ============================
    for _, row in df_filtrado.iterrows():

        idexp = row.get("IDEXPEDIENTE")

        if not idexp:
        continue

        idexp = str(idexp).strip()

        exp = (
            db.query(Expediente)
            .filter(Expediente.id_expediente == idexp)
            .first()
        )

    if not exp:
        exp = Expediente(
            id_expediente=idexp
        )
        db.add(exp)
        creados += 1
    else:
        actualizados += 1

    # ============================
    # RELLENAR TABLA PRINCIPAL
    # ============================

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

    exp.nombre_titular = (
        row.get("NOMBRETITULAR")
        or row.get("NOMBRE_TITULAR")
    )

    exp.nif_titular = (
        row.get("NIFTITULAR")
        or row.get("NIF_TITULAR")
    )

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

    exp.oficina = row.get("OFICINA")
    exp.oficina_alta = row.get("OFICINAALTA")

    exp.capital = row.get("CAPITAL")
    exp.importe = row.get("IMPORTE")
    exp.saldo_real = row.get("SALDOREAL")
    exp.saldo_disponible = row.get("SALDODISPONIBLE")

    exp.contrato = row.get("CONTRATO")

    exp.tipo_operacion = (
        row.get("TIPOOPERACION")
        or row.get("TIPO_OPERACION")
    )

    exp.subtipo_operacion = (
        row.get("SUBTIPOOPERACION")
        or row.get("SUBTIPO_OPERACION")
    )

    exp.protocolo = row.get("PROTOCOLO")

    exp.producto_gtg = (
        row.get("PRODUCTOGTG")
        or row.get("PRODUCTO_GTG")
    )

    exp.gestoria = row.get("GESTORIA")

    exp.id_expediente_cgn = (
        row.get("IDEXPEDIENTECGN")
        or row.get("ID_EXPEDIENTE_CGN")
    )

    exp.observaciones = row.get("OBSERVACIONES")

    db.flush()

    # ============================
    # GUARDAR DETALLE COMPLETO
    # ============================

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
        
        # ============================
        # 4) GUARDAR TODOS LOS CAMPOS (BATCH)
        # ============================
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

    # ============================
    # 5) INSERTAR DETALLES EN BLOQUE
    # ============================
    db.bulk_save_objects(detalles_batch)

    db.commit()

    return {
        "creados": creados,
        "actualizados": actualizados,
        "fecha_importada": fecha_objetivo.isoformat(),
        "total_filtrados": len(df_filtrado)
    }
