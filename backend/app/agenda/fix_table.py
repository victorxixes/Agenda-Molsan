from sqlalchemy import text
from backend.app.database import engine

def fix_table():
    with engine.begin() as conn:

        # Eliminar tablas antiguas
        conn.execute(text("""
            DROP TABLE IF EXISTS agenda_citas CASCADE;
        """))

        conn.execute(text("""
            DROP TABLE IF EXISTS citas CASCADE;
        """))

        # Crear tabla nueva correcta SIN estado
        conn.execute(text("""
            CREATE TABLE agenda_citas (
                id SERIAL PRIMARY KEY,
                fecha DATE NOT NULL,
                hora_inicio TIME NOT NULL,
                hora_fin TIME NOT NULL,
                tipo_cita VARCHAR NOT NULL,
                notario_id INTEGER,
                tipo_firma VARCHAR,
                apoderado_id INTEGER,
                observaciones VARCHAR
            );
        """))
