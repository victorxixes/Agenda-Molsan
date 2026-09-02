from fastapi import APIRouter, Depends
from sqlalchemy import text
from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad/repair-insert-roles-raw",
    tags=["Seguridad - Repair RAW"],
)

@router.post("")
def repair_insert_roles_raw(db = Depends(get_db)):
    try:
        db.execute(text("""
            INSERT INTO roles (nombre, descripcion, permisos_modulo_dict, modulos_visibles_list)
            VALUES 
                ('Administrador', 'Acceso total', '{}'::json, '[]'::json),
                ('Recepcion', 'Acceso a agenda y clientes', '{}'::json, '[]'::json),
                ('Direccion', 'Acceso a informes y métricas', '{}'::json, '[]'::json),
                ('Usuario', 'Acceso básico', '{}'::json, '[]'::json)
            ON CONFLICT DO NOTHING;
        """))
        db.commit()

        return {"estado": "OK - roles base insertados"}

    except Exception as e:
        return {"error": str(e)}
