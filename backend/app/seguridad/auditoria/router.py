from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.database import get_db

from backend.app.seguridad.auditoria.schemas import (
    AuditoriaCreate,
    AuditoriaOut,
)

from backend.app.seguridad.auditoria.service import (
    obtener_auditoria,
    obtener_metricas,
    registrar_auditoria,
    obtener_auditoria_empleado,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/seguridad/auditoria",
    tags=["Seguridad - Auditoría"],
)


# ============================================================
# AUDITORÍA GLOBAL
# ============================================================

@router.get(
    "/",
    response_model=list[AuditoriaOut],
    summary="Obtener auditoría global",
)
def listar_auditoria(
    db: Session = Depends(get_db),
):
    """
    Devuelve los registros de auditoría globales,
    ordenados del más reciente al más antiguo.

    El límite y la lógica de consulta pertenecen al service.
    """

    return obtener_auditoria(db)


# ============================================================
# AUDITORÍA POR EMPLEADO
# ============================================================

@router.get(
    "/empleado/{empleado_id}",
    response_model=list[AuditoriaOut],
    summary="Obtener auditoría de un empleado",
)
def listar_auditoria_empleado(
    empleado_id: int,
    db: Session = Depends(get_db),
):
    """
    Devuelve la actividad de auditoría asociada
    al empleado indicado.
    """

    return obtener_auditoria_empleado(
        db=db,
        empleado_id=empleado_id,
    )


# ============================================================
# MÉTRICAS
# ============================================================

@router.get(
    "/metricas",
    summary="Obtener métricas de auditoría",
)
def metricas(
    db: Session = Depends(get_db),
):
    """
    Devuelve las métricas agregadas de auditoría:
    - total de registros
    - registros por módulo
    - registros por acción
    - últimos logins
    """

    return obtener_metricas(db)


# ============================================================
# REGISTRAR AUDITORÍA
# ============================================================

@router.post(
    "/",
    response_model=AuditoriaOut,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar evento de auditoría",
)
def registrar(
    datos: AuditoriaCreate,
    db: Session = Depends(get_db),
):
    """
    Registra un nuevo evento de auditoría.

    El cuerpo esperado es:

    {
        "usuario": "usuario",
        "modulo": "seguridad",
        "accion": "login",
        "descripcion": "Inicio de sesión",
        "ip": "127.0.0.1"
    }
    """

    return registrar_auditoria(
        db=db,
        usuario=datos.usuario,
        modulo=datos.modulo,
        accion=datos.accion,
        descripcion=datos.descripcion,
        ip=datos.ip,
    )
