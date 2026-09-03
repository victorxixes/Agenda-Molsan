from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.logs.service import obtener_logs, registrar_log

router = APIRouter(
    prefix="/seguridad/logs",
    tags=["Seguridad - Logs"]
)

# ---------------------------------------------------------
# LISTAR LOGS
# ---------------------------------------------------------
@router.get("/")
def listar_logs(db: Session = Depends(get_db)):
    return obtener_logs(db)

# ---------------------------------------------------------
# REGISTRAR LOG (opcional)
# ---------------------------------------------------------
@router.post("/")
def registrar(
    evento: str,
    detalle: str | None = None,
    ip: str | None = None,
    db: Session = Depends(get_db)
):
    return registrar_log(db, evento, detalle, ip)
