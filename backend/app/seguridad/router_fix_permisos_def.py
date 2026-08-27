from fastapi import APIRouter
from sqlalchemy import text
from backend.app.database import engine
import json

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/fix-permisos-modulo-definitivo")
def fix_permisos_modulo_definitivo():
    cambios = 0

    with engine.connect() as conn:
        empleados = conn.execute(text("SELECT id, permisos_modulo FROM empleados_v2")).fetchall()

        for emp in empleados:
            emp_id = emp.id
            permisos = emp.permisos_modulo

            # Si está vacío → dict
            if permisos is None:
                permisos = {}

            # Si es string → intentar parsear
            if isinstance(permisos, str):
                try:
                    permisos = json.loads(permisos)
                except:
                    permisos = {}

            # 🔥 Caso crítico: si tiene el nivel extra "permisos"
            if "permisos" in permisos and isinstance(permisos["permisos"], dict):
                permisos = permisos["permisos"]

            # Asegurar que es dict
            if not isinstance(permisos, dict):
                permisos = {}

            # Convertir a JSON seguro
            json_str = json.dumps(permisos).replace("'", "''")

            # Guardar limpio
            conn.execute(
                text(f"UPDATE empleados_v2 SET permisos_modulo = '{json_str}'::jsonb WHERE id = {emp_id}")
            )

            cambios += 1

    return {
        "status": "ok",
        "empleados_corregidos": cambios
    }
