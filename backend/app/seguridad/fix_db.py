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

        @router.get("/reset-permisos")
def reset_permisos():
    db = SessionLocal()
    try:
        db.execute("DROP TABLE IF EXISTS permisos CASCADE;")

        db.execute("""
            CREATE TABLE permisos (
                id SERIAL PRIMARY KEY,
                rol_id INTEGER NOT NULL,
                modulo VARCHAR(150) NOT NULL,
                puede_ver BOOLEAN DEFAULT TRUE,
                puede_editar BOOLEAN DEFAULT FALSE,
                puede_borrar BOOLEAN DEFAULT FALSE
            );
        """)

        db.commit()
        return {"detail": "Tabla 'permisos' eliminada y recreada correctamente."}

    except Exception as e:
        db.rollback()
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

@router.get("/reset-roles")
def reset_roles():
    db = SessionLocal()
    try:
        db.execute("DROP TABLE IF EXISTS roles CASCADE;")

        db.execute("""
            CREATE TABLE roles (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) UNIQUE NOT NULL,
                descripcion VARCHAR(255)
            );
        """)

        db.commit()
        return {"detail": "Tabla 'roles' eliminada y recreada correctamente."}

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()

@router.get("/reset-secciones")
def reset_secciones():
    db = SessionLocal()
    try:
        db.execute("DROP TABLE IF EXISTS secciones CASCADE;")

        db.execute("""
            CREATE TABLE secciones (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL
            );
        """)

        db.commit()
        return {"detail": "Tabla 'secciones' eliminada y recreada correctamente."}

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()

@router.get("/reset-cargos")
def reset_cargos():
    db = SessionLocal()
    try:
        db.execute("DROP TABLE IF EXISTS cargos CASCADE;")

        db.execute("""
            CREATE TABLE cargos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL
            );
        """)

        db.commit()
        return {"detail": "Tabla 'cargos' eliminada y recreada correctamente."}

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()

@router.get("/reset-todo")
def reset_todo():
    db = SessionLocal()
    try:
        # ROLES
        db.execute("DROP TABLE IF EXISTS roles CASCADE;")
        db.execute("""
            CREATE TABLE roles (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) UNIQUE NOT NULL,
                descripcion VARCHAR(255)
            );
        """)

        # DEPARTAMENTOS
        db.execute("DROP TABLE IF EXISTS departamentos CASCADE;")
        db.execute("""
            CREATE TABLE departamentos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                descripcion VARCHAR(255)
            );
        """)

        # SECCIONES
        db.execute("DROP TABLE IF EXISTS secciones CASCADE;")
        db.execute("""
            CREATE TABLE secciones (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL
            );
        """)

        # PERMISOS
db.execute("DROP TABLE IF EXISTS permisos CASCADE;")
db.execute("""
    CREATE TABLE permisos (
        id SERIAL PRIMARY KEY,
        rol_id INTEGER NOT NULL,
        modulo VARCHAR(150) NOT NULL,
        puede_ver BOOLEAN DEFAULT TRUE,
        puede_editar BOOLEAN DEFAULT FALSE,
        puede_borrar BOOLEAN DEFAULT FALSE
    );
""")

        # CARGOS
        db.execute("DROP TABLE IF EXISTS cargos CASCADE;")
        db.execute("""
            CREATE TABLE cargos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL
            );
        """)

        # EMPLEADOS
        db.execute("DROP TABLE IF EXISTS empleados CASCADE;")
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
        return {"detail": "Todas las tablas han sido reseteadas correctamente."}

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()

@router.get("/create-roles-base")
def create_roles_base():
    db = SessionLocal()
    try:
        # Crear roles base si no existen
        db.execute("""
            INSERT INTO roles (nombre, descripcion)
            VALUES 
                ('admin', 'Administrador del sistema'),
                ('empleado', 'Empleado estándar'),
                ('rrhh', 'Recursos Humanos'),
                ('direccion', 'Dirección')
            ON CONFLICT (nombre) DO NOTHING;
        """)

        db.commit()
        return {"detail": "Roles base creados correctamente."}

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()
