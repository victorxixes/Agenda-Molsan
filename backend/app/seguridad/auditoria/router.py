from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from backend.app.database import get_db

router = APIRouter(prefix="/auditoria", tags=["Auditoria"])

# ---------------------------------------------------------
# LISTAR AUDITORÍA
# ---------------------------------------------------------
@router.get("/")
def listar_auditoria(db: Session = Depends(get_db)):
    # Ejemplo mínimo
    return [
        {
            "id": 1,
            "usuario": "admin",
            "accion": "login",
            "descripcion": "Inicio de sesión",
            "fecha": datetime.now().isoformat()
        }
    ]

# ---------------------------------------------------------
# MÉTRICAS
# ---------------------------------------------------------
@router.get("/metricas")
def metricas_auditoria(db: Session = Depends(get_db)):
    return {
        "total_registros": 1,
        "por_modulo": [
            {"modulo": "auth", "cantidad": 1}
        ],
        "por_accion": [
            {"accion": "login", "cantidad": 1}
        ],
        "ultimos_logins": [
            {
                "usuario_id": 1,
                "fecha": datetime.now().isoformat(),
                "modulo": "auth"
            }
        ]
    }
