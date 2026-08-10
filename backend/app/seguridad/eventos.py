from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

@router.get("/eventos")
def listar_eventos():
    # Ejemplo mínimo para que el módulo funcione
    return [
        {
            "id": 1,
            "tipo": "login",
            "usuario": "admin",
            "fecha": datetime.now().isoformat()
        }
    ]
