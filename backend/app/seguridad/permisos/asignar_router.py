from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.empleados.models import Empleado


router = APIRouter(
    prefix="/seguridad/asignar",
    tags=["Seguridad - Asignación"]
)


# ============================================================
# HELPERS
# ============================================================

def _lista_strings(valor):
    """
    Devuelve únicamente valores string.
    """

    if not isinstance(valor, list):
        return []

    return [
        item
        for item in valor
        if isinstance(item, str)
    ]


def _permisos_dict(valor):
    """
    Normaliza un diccionario de permisos.

    Formato:

        {
            "expedientes": [
                "ver",
                "crear"
            ]
        }
    """

    if not isinstance(valor, dict):
        return {}

    resultado = {}

    for modulo, permisos in valor.items():

        if not isinstance(modulo, str):
            continue

        resultado[modulo] = _lista_strings(
            permisos
        )

    return resultado


# ============================================================
# ASIGNAR MÓDULOS
# ============================================================

@router.post(
    "/empleado/{empleado_id}/modulos"
)
def asignar_modulos(
    empleado_id: int,
    modulos: list,
    db: Session = Depends(get_db)
):
    """
    Asigna los módulos visibles a un empleado.
    """

    empleado = (
        db.query(Empleado)
        .filter(
            Empleado.id == empleado_id
        )
        .first()
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    modulos_limpios = _lista_strings(
        modulos
    )

    empleado.modulos_visibles_list = (
        modulos_limpios
    )

    db.commit()
    db.refresh(empleado)

    return {
        "estado": "OK",
        "empleado_id": empleado.id,
        "modulos_asignados": (
            modulos_limpios
        ),
    }


# ============================================================
# ASIGNAR PERMISOS
# ============================================================

@router.post(
    "/empleado/{empleado_id}/permisos"
)
def asignar_permisos(
    empleado_id: int,
    permisos: dict,
    db: Session = Depends(get_db)
):
    """
    Asigna permisos personalizados a un empleado.
    """

    empleado = (
        db.query(Empleado)
        .filter(
            Empleado.id == empleado_id
        )
        .first()
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    permisos_limpios = _permisos_dict(
        permisos
    )

    empleado.permisos_modulo_dict = (
        permisos_limpios
    )

    db.commit()
    db.refresh(empleado)

    return {
        "estado": "OK",
        "empleado_id": empleado.id,
        "permisos_asignados": (
            permisos_limpios
        ),
    }
