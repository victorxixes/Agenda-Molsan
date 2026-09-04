from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.auth.schemas import LoginRequest
from backend.app.empleados.service import login_empleado
from backend.app.auth.service import crear_token, serializar_empleado
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


# ---------------------------------------------------------
# LOGIN ADMIN (UNIFICADO + AUDITORÍA + LOGS)
# ---------------------------------------------------------
import hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@router.options("/admin/login")
def options_login():
    return {}


@router.post("/admin/login")
def login_admin(data: LoginRequest, db: Session = Depends(get_db)):
    # Validar usuario
    if data.usuario != "admin":
        registrar_log(db, "login_error", f"Intento de login admin con usuario {data.usuario}")
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    # Validar contraseña
    if hash_password(data.password) != hash_password("admin"):
        registrar_log(db, "login_error", "Contraseña incorrecta en login admin")
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    # Crear objeto admin con los campos que crear_token necesita
    admin_obj = type(
        "Admin",
        (),
        {
            "id": 1,
            "usuario": "admin",
            "nombre": "Administrador",
            "rol_id": 0,
            "rol_nombre": "admin",
        }
    )()

    # Token unificado
    token = crear_token(admin_obj)

    # Auditoría
    registrar_auditoria(
        db,
        usuario="admin",
        modulo="auth",
        accion="login",
        descripcion="Inicio de sesión admin",
        ip=None
    )

    # Respuesta final
    return {
        "token": token,
        "empleado": {
            "empleado_id": 1,
            "nombre": "Administrador",
            "foto": "default-avatar.png",
            "rol_id": 0,
            "rol_nombre": "admin",
            "modulos_visibles": [
                "dashboard", "agenda", "empleados", "informes", "intranet",
                "auditoria", "seguridad", "utilidades", "logs", "ctn",
                "maestros", "mensajes", "realtime", "notarios", "documentos"
            ],
            "permisos_modulo": {
                "dashboard": ["ver", "crear", "editar", "eliminar"],
                "agenda": ["ver", "crear", "editar", "eliminar"],
                "empleados": ["ver", "crear", "editar", "eliminar"],
                "informes": ["ver", "crear", "editar", "eliminar"],
                "intranet": ["ver", "crear", "editar", "eliminar"],
                "auditoria": ["ver"],
                "seguridad": ["ver", "crear", "editar"],
                "utilidades": ["ver"],
                "logs": ["ver"],
                "ctn": ["ver"],
                "maestros": ["ver", "crear", "editar", "eliminar"],
                "mensajes": ["ver", "crear"],
                "realtime": ["ver"],
                "notarios": ["ver", "crear", "editar"],
                "documentos": ["ver", "crear", "editar"]
            }
        }
    }


    # Token unificado
    token = crear_token(type("Admin", (), {"id": 1, "usuario": "admin", "rol": None}))

    # Auditoría
    registrar_auditoria(
        db,
        usuario="admin",
        modulo="auth",
        accion="login",
        descripcion="Inicio de sesión admin",
        ip=None
    )

    return {
        "token": token,
        "empleado": empleado
    }
