from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json

from backend.app.database import get_db, SessionLocal
from backend.app.empleados.models import Empleado
from backend.app.seguridad.models import Rol
from backend.app.seguridad.init_roles import init_roles
from backend.app.seguridad.init_admin import init_admin

router = APIRouter(
    prefix="/seguridad/repair",
    tags=["Seguridad - Repair"],
)


def _safe_list(value):
    if isinstance(value, str):
        try:
            return json.loads(value)
        except:
            return []
    return value or []


def _safe_dict(value):
    if isinstance(value, str):
        try:
            return json.loads(value)
        except:
            return {}
    return value or {}


@router.get("")
def reparar_todo(db: Session = Depends(get_db)):
    resumen = {
        "empleados_reparados": 0,
        "empleados_rol_id_nulo": 0,
        "empleados_jsonb_reparado": 0,
        "roles_creados": 0,
        "admin_recreado": False,
    }

    # ---------------------------------------------------------
    # 1. Reparar rol_id inválidos
    # ---------------------------------------------------------
    roles_ids = [r.id for r in db.query(Rol.id).all()]
    empleados = db.query(Empleado).all()

    for e in empleados:
        if e.rol_id is not None and e.rol_id not in roles_ids:
            e.rol_id = None
            resumen["empleados_rol_id_nulo"] += 1

    db.commit()

    # ---------------------------------------------------------
    # 2. Reparar JSONB de empleados
    # ---------------------------------------------------------
    for e in empleados:
        original_mv = e.modulos_visibles_list
        original_pm = e.permisos_modulo_dict

        mv = _safe_list(e.modulos_visibles_list)
        pm = _safe_dict(e.permisos_modulo_dict)

        # Compatibilidad ERP antiguo
        if hasattr(e, "modulos_visibles") and e.modulos_visibles:
            mv = _safe_list(e.modulos_visibles)

        if hasattr(e, "permisos_modulo") and e.permisos_modulo:
            pm = _safe_dict(e.permisos_modulo)

        if mv != original_mv or pm != original_pm:
            e.modulos_visibles_list = mv
            e.permisos_modulo_dict = pm
            resumen["empleados_jsonb_reparado"] += 1

    db.commit()

    # ---------------------------------------------------------
    # 3. Inicializar roles base (si faltan)
    # ---------------------------------------------------------
    before_roles = db.query(Rol).count()
    init_roles()
    after_roles = SessionLocal().query(Rol).count()
    resumen["roles_creados"] = max(0, after_roles - before_roles)

    # ---------------------------------------------------------
    # 4. Recrear admin si está corrupto o no existe
    # ---------------------------------------------------------
    admin = db.query(Empleado).filter(Empleado.usuario == "admin").first()
    if not admin:
        init_admin()
        resumen["admin_recreado"] = True
    else:
        # asegurar que tiene rol válido
        rol_admin = db.query(Rol).filter(Rol.nombre == "Administrador").first()
        if rol_admin and admin.rol_id != rol_admin.id:
            admin.rol_id = rol_admin.id
            db.commit()
            resumen["admin_recreado"] = True

    # ---------------------------------------------------------
    # 5. Resumen final
    # ---------------------------------------------------------
    resumen["empleados_reparados"] = len(empleados)

    return resumen
