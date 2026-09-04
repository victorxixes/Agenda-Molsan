from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.auth.schemas import LoginRequest
from backend.app.empleados.service import login_empleado
from backend.app.seguridad.auditoria.service import registrar_auditoria
from backend.app.seguridad.logs.service import registrar_log

router = APIRouter(prefix="/auth", tags=["Auth"])


# ---------------------------------------------------------
# LOGIN EMPLEADOS (UNIFICADO + AUDITORÍA + LOGS)
# ---------------------------------------------------------
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    resultado = login_empleado(db, data.usuario, data.password)

    if not resultado:
        registrar_log(db, "login_error", f"Credenciales incorrectas para {data.usuario}")
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    empleado = resultado["empleado"]
    token = resultado["token"]

    # Auditoría
    registrar_auditoria(
        db,
        usuario=data.usuario,
        modulo="auth",
        accion="login",
        descripcion="Inicio de sesión",
        ip=None
    )

    return {
        "token": token,
        "empleado": empleado
    }
