from sqlalchemy.orm import Session
from datetime import date, timedelta

from backend.app.agenda.models import Cita
from backend.app.ctn.models import Notaria  # si existe
from backend.app.empleados.models import Empleado  # si existe


# ---------------------------------------------------------
# RESUMEN AGENDA (día, semana, mes)
# ---------------------------------------------------------
def resumen_agenda(db: Session, year: int, month: int, day: int):
    fecha = date(year, month, day)
    inicio_semana = fecha
    fin_semana = fecha + timedelta(days=6)

    citas_dia = db.query(Cita).filter(Cita.fecha == fecha).all()
    citas_semana = db.query(Cita).filter(Cita.fecha >= inicio_semana).filter(Cita.fecha <= fin_semana).all()
    citas_mes = db.query(Cita).filter(Cita.fecha >= date(year, month, 1)).filter(Cita.fecha <= date(year, month, 31)).all()

    def contar(citas):
        return {
            "total": len(citas),
            "confirmadas": len([c for c in citas if c.estado == "Confirmada"]),
            "finalizadas": len([c for c in citas if c.estado == "Finalizada"]),
            "canceladas": len([c for c in citas if c.estado == "Cancelada"]),
        }

    return {
        "dia": contar(citas_dia),
        "semana": contar(citas_semana),
        "mes": contar(citas_mes)
    }


# ---------------------------------------------------------
# INFORME APODERADOS
# ---------------------------------------------------------
def resumen_apoderados(db: Session):
    empleados = db.query(Empleado).all()
    citas = db.query(Cita).all()

    informe = []

    for emp in empleados:
        emp_citas = [c for c in citas if c.apoderado_id == emp.id]
        informe.append({
            "apoderado_id": emp.id,
            "nombre": emp.nombre,
            "total_citas": len(emp_citas),
            "finalizadas": len([c for c in emp_citas if c.estado == "Finalizada"]),
            "canceladas": len([c for c in emp_citas if c.estado == "Cancelada"]),
        })

    return informe


# ---------------------------------------------------------
# MAPA DE CALOR DE ZONAS
# ---------------------------------------------------------
def mapa_calor_zonas(db: Session):
    citas = db.query(Cita).all()

    zonas = {}

    for c in citas:
        zona = getattr(c, "zona", "Desconocida")
        zonas.setdefault(zona, 0)
        zonas[zona] += 1

    return [{"zona": z, "total_visitas": t} for z, t in zonas.items()]
