from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from backend.app.empleados.service import hash_password


router = APIRouter(
    prefix="/seguridad/asignar",
    tags=["Seguridad - Asignación"],
)


# ============================================================
# SCHEMA
# ============================================================

class PasswordResetRequest(BaseModel):
    nueva_password: str


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post(
    "/empleado/{empleado_id}/password"
)
def resetear_password(
    empleado_id: int,
    datos: PasswordResetRequest,
    db: Session = Depends(get_db),
):
    """
    Actualiza la contraseña de un empleado.

    Body esperado:

    {
        "nueva_password": "NuevaClave123"
    }
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
            detail="Empleado no encontrado",
        )

    nueva_password = (
        datos.nueva_password.strip()
    )

    if not nueva_password:
        raise HTTPException(
            status_code=400,
            detail="La nueva contraseña no puede estar vacía",
        )

    if len(nueva_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="La nueva contraseña debe tener al menos 6 caracteres",
        )

    empleado.password = hash_password(
        nueva_password
    )

    db.commit()
    db.refresh(empleado)

    return {
        "estado": "OK",
        "empleado_id": empleado.id,
        "detalle": (
            "Contraseña actualizada correctamente"
        ),
    }
