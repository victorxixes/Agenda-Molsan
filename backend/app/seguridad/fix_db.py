from fastapi import APIRouter
from backend.app.database import SessionLocal

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

@router.get("/fix-db")
def fix_db():
    db = SessionLocal()
    try:
        # Intentar añadir la columna si no existe
        db.execute("""
            ALTER TABLE departamentos 
            ADD COLUMN IF NOT EXISTS descripcion VARCHAR(255);
        """)
        db.commit()
        return {"detail": "Columna 'descripcion' añadida correctamente."}

    except Exception as e:
        return {"error": str(e)}

    finally:
        db.close()

@router.get("/reset-empleados")
def reset_empleados():
    db = SessionLocal()
    try:
        # 1. Eliminar la tabla si existe
        db.execute("DROP TABLE IF EXISTS empleados CASCADE;")

        # 2. Crear la tabla nuevamente con la estructura correcta
        db.execute("""
            CREATE TABLE empleados (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                apellidos VARCHAR(150) NOT NULL,
                dni VARCHAR(50),
                telefono VARCHAR(50),
                email_personal VARCHAR(150),
                email_empresa VARCHAR(150),
                extension VARCHAR(50),
                fecha_alta DATE,
                departamento_id INTEGER,
                seccion_id INTEGER,
                cargo_id INTEGER,
                usuario VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                activo BOOLEAN DEFAULT TRUE,
                modulos_visibles_list JSONB,
                permisos_modulo_dict JSONB,
                rol_id INTEGER
            );
        """)

        db.commit()
        return {"detail": "Tabla 'empleados' eliminada y recreada correctamente."}

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()
