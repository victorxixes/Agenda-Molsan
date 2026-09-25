from fastapi import APIRouter, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
import pandas as pd
from app.models import Cliente, Expediente, ExpedienteFinca

router = APIRouter()

@router.post("/api/expedientes/importar-excel")
async def importar_expedientes_excel(
    fichero: UploadFile = File(...),
    db: Session = get_db(),
):
    if not fichero.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="El fichero debe ser Excel")

    contenido = await fichero.read()
    try:
        df = pd.read_excel(contenido)
    except Exception:
        raise HTTPException(status_code=400, detail="No se pudo leer el Excel")

    creados_exp = 0
    actualizados_exp = 0

    for _, row in df.iterrows():
        id_expediente = str(row.get("IDEXPEDIENTE")).strip()
        nif_solicitante = str(row.get("NIFSOLICITANTE")).strip() if row.get("NIFSOLICITANTE") else None
        nombre_solicitante = str(row.get("NOMBRESOLICITANTE")).strip() if row.get("NOMBRESOLICITANTE") else None
        finca_num = str(row.get("FINCA")).strip() if row.get("FINCA") else None

        if not id_expediente:
            continue  # fila inválida

        # 1) Cliente
        cliente = None
        if nif_solicitante:
            cliente = db.query(Cliente).filter(Cliente.dni == nif_solicitante).first()
            if not cliente:
                cliente = Cliente(
                    dni=nif_solicitante,
                    nombre=nombre_solicitante or "",
                )
                db.add(cliente)
                db.flush()

        # 2) Expediente
        expediente = db.query(Expediente).filter(Expediente.id_expediente == id_expediente).first()
        if not expediente:
            expediente = Expediente(
                id_expediente=id_expediente,
                cliente_id=cliente.id if cliente else None,
                estado_expediente=row.get("ESTADOEXPEDIENTE"),
                fecha_alta=row.get("FECHAALTA"),
                origen_bankia=row.get("ORIGENBANKIA"),
                producto_gtg=row.get("PRODUCTOGTG"),
                capital=row.get("CAPITAL"),
                importe=row.get("IMPORTE"),
            )
            db.add(expediente)
            creados_exp += 1
        else:
            # actualizar campos básicos
            expediente.estado_expediente = row.get("ESTADOEXPEDIENTE")
            expediente.producto_gtg = row.get("PRODUCTOGTG")
            actualizados_exp += 1

        db.flush()

        # 3) Finca
        if finca_num:
            finca = ExpedienteFinca(
                expediente_id=expediente.id,
                numero_finca=finca_num,
            )
            db.add(finca)

    db.commit()

    return {
        "status": "ok",
        "expedientes_creados": creados_exp,
        "expedientes_actualizados": actualizados_exp,
    }
