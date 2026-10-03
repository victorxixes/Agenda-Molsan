from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from backend.app.database import get_db

from backend.app.seguridad.logs.schemas import (
    LogCreate,
    LogOut,
)

from backend.app.seguridad.logs.service import (
    obtener_logs,
    registrar_log,
)


router = APIRouter(
    prefix="/seguridad/logs",
    tags=["Seguridad - Logs"],
)


# ============================================================
# LISTAR LOGS
# ============================================================

@router.get(
    "/",
    response_model=list[LogOut],
)
def listar_logs(
    evento: Optional[str] = None,
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    db: Session = Depends(get_db),
):
    return obtener_logs(
        db=db,
        evento=evento,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
    )


# ============================================================
# REGISTRAR LOG
# ============================================================

@router.post(
    "/",
    response_model=LogOut,
)
def registrar(
    payload: LogCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    ip = payload.ip

    # --------------------------------------------------------
    # SI NO VIENE IP, INTENTAMOS OBTENERLA DE LA PETICIÓN
    # --------------------------------------------------------

    if not ip and request.client:
        ip = request.client.host

    return registrar_log(
        db=db,
        evento=payload.evento,
        detalle=payload.detalle,
        ip=ip,
    )
