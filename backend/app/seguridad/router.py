from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.empleados.models import Empleado
from backend.app.maestros.models import Departamento, Seccion, Cargo

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/empleado/{empleado_id}/ficha-completa")
def ficha_completa(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # Relaciones maestros
    departamento = None
    seccion = None
    cargo = None

    if empleado.departamento_id:
        departamento = db.query(Departamento).filter(Departamento.id == empleado.departamento_id).first()

    if empleado.seccion_id:
        seccion = db.query(Seccion).filter(Seccion.id == empleado.seccion_id).first()

    if empleado.cargo_id:
        cargo = db.query(Cargo).filter(Cargo.id == empleado.cargo_id).first()

    # Auditoría (si la quieres)
    auditoria = []  # Aquí puedes añadir tu sistema de logs

    return {
        "empleado": empleado,
        "modulos_visibles": empleado.modulos_visibles_list,
        "permisos_modulo": empleado.permisos_modulo_dict,
        "departamento": departamento,
        "seccion": seccion,
        "cargo": cargo,
        "auditoria": auditoria
    }
