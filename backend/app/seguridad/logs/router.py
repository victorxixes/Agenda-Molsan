from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.logs.service import obtener_logs

router = APIRouter(
    prefix="/seguridad/logs",
    tags=["Seguridad - Logs"]
)

@router.get("/")
def listar_logs(db: Session = Depends(get_db)):
    return obtener_logs(db)
