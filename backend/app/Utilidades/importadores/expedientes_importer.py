import pandas as pd
from sqlalchemy.orm import Session
from app.models import Cliente, Expediente, ExpedienteFinca

def importar_excel_expedientes(db: Session, contenido_excel: bytes):
    df = pd.read_excel(contenido_excel)

    creados = 0
    actualizados = 0

    for _, row in df.iterrows():
        idexp = str(row.get("IDEXPEDIENTE")).strip()
        if not idexp:
            continue

        # Cliente
        nif = str(row.get("NIFSOLICITANTE")).strip() if row.get("NIFSOLICITANTE") else None
        nombre = str(row.get("NOMBRESOLICITANTE")).strip() if row.get("NOMBRESOLICITANTE") else ""

        cliente = None
        if nif:
            cliente = db.query(Cliente).filter(Cliente.dni == nif).first()
            if not cliente:
                cliente = Cliente(dni=nif, nombre=nombre)
                db.add(cliente)
                db.flush()

        # Expediente
        exp = db.query(Expediente).filter(Expediente.id_expediente == idexp).first()

        if not exp:
            exp = Expediente(
                id_expediente=idexp,
                cliente_id=cliente.id if cliente else None,
                estado_expediente=row.get("ESTADOEXPEDIENTE"),
                fecha_alta=row.get("FECHAALTA"),
                producto_gtg=row.get("PRODUCTOGTG"),
                capital=row.get("CAPITAL"),
                importe=row.get("IMPORTE"),
            )
            db.add(exp)
            creados += 1
        else:
            exp.estado_expediente = row.get("ESTADOEXPEDIENTE")
            exp.producto_gtg = row.get("PRODUCTOGTG")
            actualizados += 1

        db.flush()

        # Finca
        finca_num = row.get("FINCA")
        if finca_num:
            db.add(ExpedienteFinca(
                expediente_id=exp.id,
                numero_finca=str(finca_num)
            ))

    db.commit()

    return {
        "creados": creados,
        "actualizados": actualizados
    }
