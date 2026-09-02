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
