import pandas as pd
from sqlalchemy.orm import Session

from backend.app.expedientes.models import Expediente
from backend.app.expedientes.detalle.models import ExpedienteDetalle


def importar_excel_expedientes(db: Session, contenido_excel: bytes):
    df = pd.read_excel(contenido_excel)

    creados = 0
    actualizados = 0

    for _, row in df.iterrows():

        # ============================
        # 1) ID EXPEDIENTE
        # ============================
        idexp = str(row.get("IDEXPEDIENTE")).strip() if row.get("IDEXPEDIENTE") else None
        if not idexp:
            continue

        # ============================
        # 2) Crear expediente si no existe
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
        # 3) Guardar TODOS los campos del Excel en tabla unificada
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
        "actualizados": actualizados
    }
