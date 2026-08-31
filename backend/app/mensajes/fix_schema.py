from backend.app.database import engine

def fix_mensajes_schema():
    with engine.connect() as conn:
        conn.execute("""
            DO $$
            BEGIN
                -- Añadir columna ultima_actividad si no existe
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='mensajes_usuarios_estado'
                    AND column_name='ultima_actividad'
                ) THEN
                    ALTER TABLE mensajes_usuarios_estado
                    ADD COLUMN ultima_actividad TIMESTAMP DEFAULT NOW();
                END IF;
            END;
            $$;
        """)
