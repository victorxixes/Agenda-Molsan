from fastapi import APIRouter
from backend.app.database import engine

router = APIRouter(prefix="/api/mensajes", tags=["MensajesRepair"])

@router.post("/repair")
def repair_mensajes_estado():
    with engine.connect() as conn:
        # 1. Eliminar tabla corrupta
        conn.execute("DROP TABLE IF EXISTS mensajes_usuarios_estado CASCADE;")

        # 2. Crear tabla correcta
        conn.execute("""
            CREATE TABLE mensajes_usuarios_estado (
                usuario_id INTEGER PRIMARY KEY REFERENCES empleados(id) ON DELETE CASCADE,
                conectado BOOLEAN DEFAULT FALSE,
                ultima_actividad TIMESTAMP DEFAULT NOW()
            );
        """)

    return {"status": "ok", "message": "Tabla mensajes_usuarios_estado reparada"}
