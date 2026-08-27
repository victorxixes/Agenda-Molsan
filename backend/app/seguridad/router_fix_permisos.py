import json
from sqlalchemy import text
from backend.app.database import engine
from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/fix-permisos-modulo")
def fix_permisos_modulo():
    cambios = 0

    with engine.connect() as conn:
        empleados = conn.execute(text("SELECT id, permisos_modulo FROM empleados_v2")).fetchall()

        for emp in empleados:
            emp_id = emp.id
            permisos = emp.permisos_modulo

            # Normalizar a dict
            if permisos is None:
                permisos = {}

            if isinstance(permisos, str):
                try:
                    permisos = json.loads(permisos)
                except:
                    permisos = {}

            if not isinstance(permisos, dict):
                permisos = {}

            limpio = {}

            for clave, valor in permisos.items():
                if isinstance(valor, list):
                    limpio[clave] = valor
                elif isinstance(valor, str):
                    limpio[clave] = [valor]
                elif isinstance(valor, dict):
                    limpio[clave] = list(valor.keys())
                else:
                    limpio[clave] = []

            # 🔥 aquí el cambio: convertir dict → JSON string y castear a jsonb
            conn.execute(
                text("UPDATE empleados_v2 SET permisos_modulo = :p::jsonb WHERE id = :id"),
                {"p": json.dumps(limpio), "id": emp_id}
            )

            cambios += 1

    return {
        "status": "ok",
        "empleados_corregidos": cambios
    }
