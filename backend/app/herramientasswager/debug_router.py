from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/debug",
    tags=["Debug"]
)

# ---------------------------------------------------------
# LISTAR TODAS LAS TABLAS
# ---------------------------------------------------------
@router.get("/tablas")
def listar_tablas(db: Session = Depends(get_db)):
    result = db.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tablas = [row[0] for row in result]
    return {"tablas": tablas}


# ---------------------------------------------------------
# DESCRIBIR COLUMNAS DE UNA TABLA
# ---------------------------------------------------------
@router.get("/describe/{tabla}")
def describir_columnas(tabla: str, db: Session = Depends(get_db)):
    tabla = tabla.replace(";", "").replace("--", "")
    result = db.execute(f"""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '{tabla}'
        ORDER BY ordinal_position;
    """)
    columnas = [{"columna": row[0], "tipo": row[1]} for row in result]
    return {"tabla": tabla, "columnas": columnas}


# ---------------------------------------------------------
# OBTENER CONTENIDO DE UNA TABLA
# ---------------------------------------------------------
@router.get("/contenido/{tabla}")
def obtener_contenido(tabla: str, db: Session = Depends(get_db)):
    tabla = tabla.replace(";", "").replace("--", "")
    try:
        result = db.execute(f"SELECT * FROM {tabla};")
        filas = [dict(row) for row in result]
        return {"tabla": tabla, "filas": filas}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
