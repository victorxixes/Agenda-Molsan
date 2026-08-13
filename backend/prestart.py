import sys
import os
from sqlalchemy import text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))      # /app/backend
APP_DIR = os.path.join(BASE_DIR, "app")                    # /app/backend/app

sys.path.append(BASE_DIR)
sys.path.append(APP_DIR)

from backend.app.database import engine


print(">>> Ejecutando prestart.py para recrear agenda_citas...")

with engine.begin() as conn:
    conn.execute(text("DROP TABLE IF EXISTS agenda_citas CASCADE;"))
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
            observaciones VARCHAR,
            estado VARCHAR DEFAULT 'Pendiente'
        );
    """))

print(">>> Tabla agenda_citas recreada correctamente.")
