from sqlalchemy import text
from backend.app.database import engine


def bootstrap_agenda():
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS agenda_citas (
                id SERIAL PRIMARY KEY,
                fecha DATE NOT NULL,
                hora_inicio TIME NOT NULL,
                hora_fin TIME NOT NULL,
                tipo_cita VARCHAR NOT NULL,
                notario_id INTEGER,
                tipo_firma VARCHAR,
                apoderado_id INTEGER,
                observaciones VARCHAR,
                estado VARCHAR DEFAULT 'Pendiente'
            );
        """))
        conn.commit()
