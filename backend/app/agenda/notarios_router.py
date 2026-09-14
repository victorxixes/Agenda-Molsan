from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.ctn.service import listar_notarias

router = APIRouter(prefix="/agenda-notarios", tags=["Agenda"])


# =========================================================
# LISTAR NOTARIOS (con distancia Molsan → Notaría)
# =========================================================
@router.get("/notarios")
def obtener_notarios(db: Session = Depends(get_db)):
    notarias = listar_notarias(db)

    resultado = []

    for n in notarias:
        resultado.append({
            "id": n.id,
            "codigo": n.codigo,
            "nombre": n.nombre,
            "apellidos": n.apellidos,
            "nif": n.nif,
            "telefono": n.telefono,

            "departamento_cancelaciones": n.departamento_cancelaciones,
            "departamento_copias": n.departamento_copias,
            "otros_departamentos": n.otros_departamentos,

            "cp": n.cp,
            "provincia": n.provincia,
            "municipio": n.municipio,

            "vc": n.vc,
            "apoderado_id": n.apoderado_id,
            "apoderado_s": n.apoderado_s,
            "observacion": n.observacion,

            # Dirección simple del Excel
            "direccion": f"{n.municipio}, {n.provincia}"
        })

    return resultado
