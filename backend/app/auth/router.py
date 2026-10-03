from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.auth.schemas import LoginRequest
from backend.app.empleados.service import login_empleado
from backend.app.seguridad.auditoria.service import registrar_auditoria
from backend.app.seguridad.logs.service import registrar_log


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/login")
def login(
    data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    # ========================================================
    # IP
    # ========================================================

    ip = (
        request.client.host
        if request.client
        else None
    )

    # ========================================================
    # LOGIN
    # ========================================================

    resultado = login_empleado(
        db,
        data.usuario,
        data.password,
    )

    # ========================================================
    # LOGIN INCORRECTO
    # ========================================================

    if not resultado:

        registrar_log(
            db=db,
            evento="login_error",
            detalle=(
                f"Credenciales incorrectas "
                f"para {data.usuario}"
            ),
            ip=ip,
        )

        registrar_auditoria(
            db=db,
            usuario=data.usuario,
            modulo="auth",
            accion="login_error",
            descripcion="Credenciales incorrectas",
            ip=ip,
        )

        raise HTTPException(
            status_code=401,
            detail="Credenciales incorrectas",
        )

    # ========================================================
    # DATOS LOGIN CORRECTO
    # ========================================================

    empleado = resultado["empleado"]
    token = resultado["token"]

    # ========================================================
    # LOG TÉCNICO
    # ========================================================

    registrar_log(
        db=db,
        evento="login_success",
        detalle=(
            f"Inicio de sesión correcto "
            f"para {data.usuario}"
        ),
        ip=ip,
    )

    # ========================================================
    # AUDITORÍA FUNCIONAL
    # ========================================================

    registrar_auditoria(
        db=db,
        usuario=data.usuario,
        modulo="auth",
        accion="login",
        descripcion="Inicio de sesión",
        ip=ip,
    )

    # ========================================================
    # RESPUESTA
    # ========================================================

    return {
        "token": token,
        "empleado": empleado,
    }
