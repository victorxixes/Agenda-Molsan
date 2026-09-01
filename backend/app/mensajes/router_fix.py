from fastapi import APIRouter
from backend.app.database import engine

router = APIRouter()

@router.post("/api/mensajes/fix")
def fix_mensajes_schema():
    with engine.connect() as conn:
        # Verificar si la columna existe
        result = conn.execute("""
            SELECT column_name 
            FROM information_schema.columns
            WHERE table_name='mensajes_usuarios_estado'
            AND column_name='ultima_actividad';
        """)

        exists = result.fetchone()

        if not exists:
            conn.execute("""
                ALTER TABLE mensajes_usuarios_estado
                ADD COLUMN ultima_actividad TIMESTAMP DEFAULT NOW();
            """)

    return {"status": "ok", "message": "Schema fixed"}
