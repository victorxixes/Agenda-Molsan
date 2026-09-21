from fastapi import APIRouter, Query, Depends
from datetime import date
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from backend.app.citas.models import Cita

router = APIRouter(prefix="/informes", tags=["Informes"])

@router.get("/apoderados/tabla")
def tabla_apoderados(
    mes: int = Query(..., ge=1, le=12),
    año: int = Query(..., ge=2000, le=2100),
    db: Session = Depends(get_db)
):
    desde = date(año, mes, 1)
    hasta = date(año, mes, 31)

    empleados = db.query(Empleado).order_by(Empleado.nombre.asc()).all()

    resultado = []

    for emp in empleados:
        citas = (
            db.query(Cita)
            .filter(
                Cita.apoderado_id == emp.id,
                Cita.fecha >= desde,
                Cita.fecha <= hasta
            )
            .all()
        )

        presencial = sum(1 for c in citas if c.tipo_firma == "P")
        vc = sum(1 for c in citas if c.tipo_firma == "VC")
        km = sum(c.km for c in citas if c.tipo_firma == "P")

        resultado.append({
            "apoderado_id": emp.id,
            "nombre": emp.nombre,
            "presencial": presencial,
            "vc": vc,
            "km": km
        })

    return resultado
