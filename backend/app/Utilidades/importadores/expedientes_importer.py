import pandas as pd
from datetime import date
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente
from backend.app.expedientes.detalle.models import ExpedienteDetalle


def importar_excel_expedientes(db: Session, contenido_excel: bytes, fecha_objetivo: date = None):
     import io
     df = pd.read_excel(io.BytesIO(contenido_excel))

    # ============================
    # 0) FECHA OBJETIVO
    # ============================
    if fecha_objetivo is None:
        fecha_objetivo = date.today()

    # Convertir FECHAALTA a date si viene como datetime
    df["FECHAALTA"] = pd.to_datetime(df["FECHAALTA"]).dt.date

    # ============================
    # 1) FILTRAR SOLO EXPEDIENTES DE ESA FECHA
    # ============================
    df_filtrado = df[df["FECHAALTA"] == fecha_objetivo]

    creados = 0
    actualizados = 0

    for _, row in df_filtrado.iterrows():

        # ============================
        # 2) ID EXPEDIENTE
        # ============================
        idexp = str(row.get("IDEXPEDIENTE")).strip() if row.get("IDEXPEDIENTE") else None
        if not idexp:
            continue

        # ============================
        # 3) Crear expediente si no existe
        # ============================
        exp = db.query(Expediente).filter(Expediente.id_expediente == idexp).first()

        if not exp:
            exp = Expediente(id_expediente=idexp)
            db.add(exp)
            db.flush()
            creados += 1
        else:
            actualizados += 1

        # ============================
        # 4) Guardar TODOS los campos del Excel en tabla unificada
        # ============================
        for col in df.columns:
            valor = row.get(col)
            if valor is not None:
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
