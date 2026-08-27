from fastapi import APIRouter
from sqlalchemy import text
from backend.app.database import engine
import json

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

                # Si ya es lista → OK
                if isinstance(valor, list):
                    limpio[clave] = valor
                    continue

                # Si es string → convertir a lista
                if isinstance(valor, str):
                    limpio[clave] = [valor]
                    continue

                # Si es dict → convertir claves en lista
                if isinstance(valor, dict):
                    limpio[clave] = list(valor.keys())
                    continue

                # Cualquier otra cosa → lista vacía
                limpio[clave] = []

            conn.execute(
                text("UPDATE empleados_v2 SET permisos_modulo = :p WHERE id = :id"),
                {"p": limpio, "id": emp_id}
            )

            cambios += 1

    return {
        "status": "ok",
        "empleados_corregidos": cambios
    }
