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

    # Convertir fechas con seguridad
    df["FECHAALTA"] = pd.to_datetime(df["FECHAALTA"], errors="coerce").dt.date

    print("VALORES FECHAALTA:", df["FECHAALTA"].head())

    # ============================
    # 2) FILTRAR SOLO EXPEDIENTES DE ESA FECHA
    # ============================
    df_filtrado = df[df["FECHAALTA"] == fecha_objetivo]

    print("FILTRADOS:", len(df_filtrado))

    creados = 0
    actualizados = 0

    # ============================
    # 3) RECORRER FILAS
    # ============================
    for _, row in df_filtrado.iterrows():

        idexp = row.get("IDEXPEDIENTE")
        if not idexp:
            print("Fila sin IDEXPEDIENTE, se ignora")
            continue

        idexp = str(idexp).strip()

        exp = db.query(Expediente).filter(Expediente.id_expediente == idexp).first()

        if not exp:
            exp = Expediente(id_expediente=idexp)
            db.add(exp)
            db.flush()
            creados += 1
        else:
            actualizados += 1

        # ============================
        # 4) GUARDAR TODOS LOS CAMPOS
        # ============================
        for col in df.columns:
            valor = row.get(col)

            if pd.isna(valor):
                valor = ""

            db.add(ExpedienteDetalle(
                expediente_id=exp.id,
                campo=str(col),
                valor=str(valor)
            ))

        db.flush()

    db.commit()

    return {
        "creados": creados,
        "actualizados": actualizados,
        "fecha_importada": fecha_objetivo.isoformat(),
        "total_filtrados": len(df_filtrado)
    }
