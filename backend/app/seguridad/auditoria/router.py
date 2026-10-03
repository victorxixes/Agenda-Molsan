from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db

from backend.app.seguridad.auditoria.service import (
    obtener_auditoria,
    obtener_metricas,
    registrar_auditoria,
    obtener_auditoria_empleado,
)


router = APIRouter(
    prefix="/seguridad/auditoria",
    tags=[
        "Seguridad - Auditoría"
    ],
)


# =========================================================
# AUDITORÍA GLOBAL
# =========================================================

@router.get("/")
def listar_auditoria(
    limite: int = Query(
        200,
        ge=1,
        le=1000,
    ),
    db: Session = Depends(get_db),
):
    """
    Devuelve los últimos registros globales de auditoría.
    """

    return obtener_auditoria(
        db,
        limite=limite,
    )


# =========================================================
# AUDITORÍA POR EMPLEADO
# =========================================================

@router.get(
    "/empleado/{empleado_id}"
)
def listar_auditoria_empleado(
    empleado_id: int,
    limite: int = Query(
        100,
        ge=1,
        le=500,
    ),
    db: Session = Depends(get_db),
):
    """
    Devuelve el histórico de auditoría de un empleado.

    `empleado_id` es el ID numérico de empleados.
    El service resuelve internamente el usuario/login
    utilizado por el histórico de auditoría.
    """

    return obtener_auditoria_empleado(
        db,
        empleado_id=empleado_id,
        limite=limite,
    )


# =========================================================
# MÉTRICAS
# =========================================================

@router.get(
    "/metricas"
)
def metricas(
    db: Session = Depends(get_db),
):
    """
    Devuelve métricas generales de auditoría.
    """

    return obtener_metricas(
        db
    )


# =========================================================
# REGISTRAR AUDITORÍA
# =========================================================

@router.post("/")
def registrar(
    usuario: str,
    modulo: str,
    accion: str,
    descripcion: str,
    ip: str | None = None,
    db: Session = Depends(get_db),
):
    """
    Registra manualmente un evento de auditoría.

    Este endpoint conserva la compatibilidad con el sistema
    actual, donde el registro se identifica por usuario/login.
    """

    return registrar_auditoria(
        db=db,
        usuario=usuario,
        modulo=modulo,
        accion=accion,
        descripcion=descripcion,
        ip=ip,
    )
