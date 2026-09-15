from fastapi import APIRouter
from backend.app.database import Base, engine

router = APIRouter(
    prefix="/utilidades",
    tags=["Utilidades"]
)

@router.post("/crear_tablas")
def crear_tablas():
    try:
        Base.metadata.create_all(bind=engine)
        return {
            "status": "ok",
            "message": "Todas las tablas han sido creadas correctamente."
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@router.post("/add_columna_direccion")
def add_columna_direccion():
    try:
        with engine.connect() as conn:
            conn.execute("""
                ALTER TABLE ctn_notarios
                ADD COLUMN IF NOT EXISTS direccion VARCHAR(255);
            """)
            conn.commit()

        return {
            "status": "ok",
            "message": "Columna 'direccion' añadida correctamente."
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
