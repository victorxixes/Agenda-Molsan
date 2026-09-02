from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
import json

from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from backend.app.seguridad.models import Rol
from backend.app.seguridad.init_admin import init_admin

router = APIRouter(
    prefix="/seguridad/repair-full",
    tags=["Seguridad - Repair Full"],
)

def safe_list(v):
    if isinstance(v, str):
        try:
            return json.loads(v)
        except:
            return []
    return v or []

def safe_dict(v):
    if isinstance(v, str):
        try:
            return json.loads(v)
        except:
            return {}
    return v or {}

@router.get("")
def repair_full(db: Session = Depends(get_db)):
    resumen = {}

    # ---------------------------------------------------------
    # 1. AÑADIR COLUMNAS FALTANTES EN roles
    # ---------------------------------------------------------
    columnas = db.execute(text("""
        SELECT column_name FROM information_schema.columns
        WHERE table_name='roles';
    """)).fetchall()

    columnas = {c[0] for c in columnas}

    if "permisos_modulo_dict" not in columnas:
        db.execute(text("ALTER TABLE roles ADD COLUMN permisos_modulo_dict JSON DEFAULT '{}'"))
        resumen["añadido_permisos_modulo_dict"] = True

    if "modulos_visibles_list" not in columnas:
        db.execute(text("ALTER TABLE roles ADD COLUMN modulos_visibles_list JSON DEFAULT '[]'"))
        resumen["añadido_modulos_visibles_list"] = True

    db.commit()

    # ---------------------------------------------------------
    # 2. REPARAR rol_id inválidos
    # ---------------------------------------------------------
    roles_ids = [r.id for r in db.query(Rol.id).all()]
    empleados = db.query(Empleado).all()

    reparados_rol = 0
    for e in empleados:
        if e.rol_id and e.rol_id not in roles_ids:
            e.rol_id = None
            reparados_rol += 1

    db.commit()
    resumen["empleados_rol_id_reparados"] = reparados_rol

    # ---------------------------------------------------------
    # 3. REPARAR JSONB de empleados
    # ---------------------------------------------------------
    reparados_jsonb = 0
    for e in empleados:
        mv = safe_list(e.modulos_visibles_list)
        pm = safe_dict(e.permisos_modulo_dict)

        if mv != e.modulos_visibles_list or pm != e.permisos_modulo_dict:
            e.modulos_visibles_list = mv
            e.permisos_modulo_dict = pm
            reparados_jsonb += 1

    db.commit()
    resumen["empleados_jsonb_reparados"] = reparados_jsonb

    # ---------------------------------------------------------
    # 4. NO RECREAR ROLES (ya están insertados)
    # ---------------------------------------------------------
    resumen["roles_creados"] = 0

    # ---------------------------------------------------------
    # 5. RECREAR ADMIN SI FALTA O ESTÁ MAL
    # ---------------------------------------------------------
    admin = db.query(Empleado).filter(Empleado.usuario == "admin").first()
    if not admin:
        init_admin()
        resumen["admin_recreado"] = True
    else:
        rol_admin = db.query(Rol).filter(Rol.nombre == "admin").first()
        if rol_admin and admin.rol_id != rol_admin.id:
            admin.rol_id = rol_admin.id
            db.commit()
            resumen["admin_reparado"] = True

    return resumen
