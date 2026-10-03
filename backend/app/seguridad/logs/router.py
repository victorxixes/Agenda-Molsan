from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Request, status
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


# ============================================================
# SEGURIDAD — LOGS ROUTER
# MOLSAN ERP SAAS PREMIUM 2027
# ============================================================


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
    summary="Obtener logs del sistema",
)
def listar_logs(
    evento: Optional[str] = None,
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    limite: int = 200,
    db: Session = Depends(get_db),
):
    """
    Obtiene los logs técnicos del sistema.

    Filtros opcionales:

    - evento
    - fecha_inicio
    - fecha_fin
    - limite

    Los registros se devuelven del más reciente
    al más antiguo.
    """

    return obtener_logs(
        db=db,
        evento=evento,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        limite=limite,
    )


# ============================================================
# REGISTRAR LOG
# ============================================================


@router.post(
    "/",
    response_model=LogOut,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar log del sistema",
)
def registrar(
    payload: LogCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Registra un nuevo evento técnico.

    La IP se obtiene preferentemente de la petición.

    Ejemplo:

    {
        "evento": "api_error",
        "detalle": "Error procesando solicitud"
    }
    """

    # --------------------------------------------------------
    # IP REAL DE LA PETICIÓN
    # --------------------------------------------------------

    ip = None

    if request.client:
        ip = request.client.host

    # --------------------------------------------------------
    # FALLBACK
    # --------------------------------------------------------

    if not ip and payload.ip:
        ip = payload.ip

    # --------------------------------------------------------
    # REGISTRAR
    # --------------------------------------------------------

    return registrar_log(
        db=db,
        evento=payload.evento,
        detalle=payload.detalle,
        ip=ip,
    )
