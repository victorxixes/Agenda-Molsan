from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.app.database import get_db

from backend.app.seguridad.logs.schemas import (
    LogCreate,
    LogOut
)

from backend.app.seguridad.logs.service import (
    obtener_logs,
    registrar_log
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/seguridad/logs",
    tags=["Seguridad - Logs"]
)


# ============================================================
# LISTAR LOGS
# ============================================================

@router.get(
    "/",
    response_model=list[LogOut]
)
def listar_logs(
    limite: int = Query(
        200,
        ge=1,
        le=1000,
        description="Número máximo de logs a devolver."
    ),
    db: Session = Depends(get_db)
):
    """
    Devuelve los últimos logs registrados,
    ordenados del más reciente al más antiguo.
    """

    return obtener_logs(
        db=db,
        limite=limite
    )


# ============================================================
# REGISTRAR LOG
# ============================================================

@router.post(
    "/",
    response_model=LogOut,
    status_code=status.HTTP_201_CREATED
)
def registrar(
    datos: LogCreate,
    db: Session = Depends(get_db)
):
    """
    Registra un nuevo evento en seguridad_logs.
    """

    return registrar_log(
        db=db,
        evento=datos.evento,
        detalle=datos.detalle,
        ip=datos.ip
    )
