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

# ============================================================
# PLANTILLA PERMISOS SJ‑2026 — SIEMPRE visible en ficha empleado
# ============================================================

PLANTILLA_PERMISOS = {
    "ctn": ["ver","crear","editar","eliminar"],
    "logs": ["ver","crear","editar","eliminar"],
    "agenda": ["ver","crear","editar","eliminar"],
    "intranet": ["ver","crear","editar","eliminar"],
    "maestros": ["ver","crear","editar","eliminar"],
    "mensajes": ["ver","crear","editar","eliminar"],
    "noticias": ["ver","crear","editar","eliminar"],
    "realtime": ["ver","crear","editar","eliminar"],
    "auditoria": ["ver","crear","editar","eliminar"],
    "dashboard": ["ver","crear","editar","eliminar"],
    "empleados": ["ver","crear","editar","eliminar"],
    "seguridad": ["ver","crear","editar","eliminar"],
    "documentos": ["ver","crear","editar","eliminar"],
    "utilidades": ["ver","crear","editar","eliminar"],
    "herramientas": ["ver","crear","editar","eliminar"],
    "panel-tecnico": ["ver","crear","editar","eliminar"],
    "notificaciones": ["ver","crear","editar","eliminar"]
}

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

    # ============================================================
    # 🔥 CORRECCIÓN CRÍTICA:
    # SI permisos_modulo_dict está vacío → devolver PLANTILLA_PERMISOS
    # ============================================================

    permisos_finales = empleado.permisos_modulo_dict or PLANTILLA_PERMISOS

    return {
        "empleado": empleado,
        "modulos_visibles": empleado.modulos_visibles_list or [],
        "permisos_modulo": permisos_finales,
        "departamento": departamento,
        "seccion": seccion,
        "cargo": cargo,
        "auditoria": auditoria
    }
