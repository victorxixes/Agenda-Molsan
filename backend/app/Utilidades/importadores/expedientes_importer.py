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

    # ============================
    # 1) FECHA OBJETIVO
    # ============================
    if fecha_objetivo is None:
        fecha_objetivo = date.today()

    if "FECHAALTA" not in df.columns:
        raise ValueError("El Excel no contiene la columna FECHAALTA")

    df["FECHAALTA"] = pd.to_datetime(df["FECHAALTA"], errors="coerce").dt.date

    df_filtrado = df[df["FECHAALTA"] == fecha_objetivo]

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

        exp = db.query(Expediente).filter(Expediente.id_expediente == idexp).first()

        if not exp:
            exp = Expediente(id_expediente=idexp)
            db.add(exp)
            creados += 1
        else:
            actualizados += 1

        # No flush aquí → mucho más rápido
        db.flush()

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
