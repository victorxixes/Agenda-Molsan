from fastapi import APIRouter, HTTPException
from sqlalchemy import inspect, text
from sqlalchemy.exc import SQLAlchemyError
from app.database import engine

router = APIRouter(prefix="/admin", tags=["Admin"])

# ---------------------------------------------------------
# 1) Comprobar si la tabla empleados existe
# ---------------------------------------------------------
@router.get("/check-empleados")
def check_empleados():
    try:
        inspector = inspect(engine)
        tablas = inspector.get_table_names()
        return {"tablas": tablas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------
# 2) Fix del esquema de empleados
# ---------------------------------------------------------
def fix_empleados_schema():
    try:
        inspector = inspect(engine)
        columnas = [col["name"] for col in inspector.get_columns("empleados")]
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error inspeccionando la tabla empleados: {str(e)}"
        )

    alteraciones = []

    def add_column(nombre: str, tipo: str):
        inspector_local = inspect(engine)
        columnas_actuales = [col["name"] for col in inspector_local.get_columns("empleados")]

        if nombre in columnas_actuales:
            return

        try:
            with engine.connect() as conn:
                conn.execute(text(f"ALTER TABLE empleados ADD COLUMN {nombre} {tipo}"))
            alteraciones.append(nombre)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error añadiendo columna '{nombre}': {str(e)}"
            )

    # -----------------------------
    # DATOS PERSONALES
    # -----------------------------
    add_column("direccion", "VARCHAR(255)")
    add_column("fecha_nacimiento", "VARCHAR(20)")
    add_column("alergias", "TEXT")
    add_column("persona_contacto", "VARCHAR(150)")
    add_column("telefono_contacto", "VARCHAR(20)")
    add_column("observaciones", "TEXT")

    # -----------------------------
    # DATOS LABORALES
    # -----------------------------
    add_column("departamento_id", "INTEGER")
    add_column("seccion_id", "INTEGER")
    add_column("cargo_id", "INTEGER")

    add_column("email_empresa", "VARCHAR(150)")
    add_column("extension", "VARCHAR(20)")
    add_column("fecha_alta", "VARCHAR(20)")
    add_column("fecha_baja", "VARCHAR(20)")

    # -----------------------------
    # USUARIO INTERNO
    # -----------------------------
    add_column("usuario", "VARCHAR(100)")
    add_column("password", "VARCHAR(255)")

    # -----------------------------
    # FOTO
    # -----------------------------
    add_column("foto", "VARCHAR(255)")

    # -----------------------------
    # JSONB
    # -----------------------------
    add_column("modulos_visibles", "JSONB")
    add_column("permisos_modulo", "JSONB")

    return {
        "status": "ok",
        "columnas_agregadas": alteraciones
    }


# ---------------------------------------------------------
# 3) Endpoint manual para ejecutar el fix
# ---------------------------------------------------------
@router.post("/fix-empleados-schema")
def ejecutar_fix_manual():
    return fix_empleados_schema()
