import pandas as pd
from sqlalchemy.orm import Session
from backend.app.expedientes.clientes.models import Cliente
from backend.app.expedientes.models import Expediente

def importar_excel_expedientes(db: Session, contenido_excel: bytes):
    df = pd.read_excel(contenido_excel)

    creados = 0
    actualizados = 0

    for _, row in df.iterrows():

        idexp = str(row.get("IDEXPEDIENTE")).strip() if row.get("IDEXPEDIENTE") else None
        if not idexp:
            continue

        nif_sol = str(row.get("NIFSOLICITANTE")).strip() if row.get("NIFSOLICITANTE") else None
        nombre_sol = str(row.get("NOMBRESOLICITANTE")).strip() if row.get("NOMBRESOLICITANTE") else ""

        cliente = None
        if nif_sol:
            cliente = db.query(Cliente).filter(Cliente.dni == nif_sol).first()
            if not cliente:
                cliente = Cliente(
                    dni=nif_sol,
                    nombre_completo=nombre_sol,
                )
                db.add(cliente)
                db.flush()

        exp = db.query(Expediente).filter(Expediente.id_expediente == idexp).first()

        if not exp:
            exp = Expediente(
                id_expediente=idexp,
                cliente_id=cliente.id if cliente else None,
                estado_expediente=row.get("ESTADOEXPEDIENTE"),
                producto_gtg=row.get("PRODUCTOGTG"),
            )
            db.add(exp)
            creados += 1
        else:
            exp.estado_expediente = row.get("ESTADOEXPEDIENTE")
            exp.producto_gtg = row.get("PRODUCTOGTG")
            actualizados += 1

        db.flush()

    db.commit()

    return {
        "creados": creados,
        "actualizados": actualizados
    }
