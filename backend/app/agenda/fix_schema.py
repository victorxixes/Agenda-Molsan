from backend.app.database import engine

def fix_agenda_schema():
    with engine.connect() as conn:
        conn.execute("""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name='agenda_citas' AND column_name='apoderado'
                ) THEN
                    ALTER TABLE agenda_citas ADD COLUMN apoderado VARCHAR(150);
                END IF;
            END;
            $$;
        """)
