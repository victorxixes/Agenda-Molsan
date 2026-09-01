from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.auth.schemas import LoginRequest
from backend.app.empleados.service import login_empleado
from backend.app.auth.service import crear_token, serializar_empleado

router = APIRouter(prefix="/auth", tags=["Auth"])


# ---------------------------------------------------------
# LOGIN EMPLEADOS (USANDO EL SERVICIO REAL)
# ---------------------------------------------------------
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    resultado = login_empleado(db, data.usuario, data.password)

    if not resultado:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {
        "token": resultado["token"],
        "empleado": resultado["empleado"]
    }


# ---------------------------------------------------------
# LOGIN ADMIN
# ---------------------------------------------------------
import hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@router.options("/admin/login")
def options_login():
    return {}


@router.post("/admin/login")
def login_admin(data: LoginRequest):
    if data.usuario != "admin":
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    if hash_password(data.password) != hash_password("admin"):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    foto = "default-avatar.png"

    return {
        "empleado_id": 1,
        "nombre": "Administrador",
        "foto": foto,

        "rol_id": 0,
        "rol_nombre": "admin",

        "modulos_visibles": [
            "dashboard",
            "agenda",
            "empleados",
            "informes",
            "intranet",
            "auditoria",
            "seguridad",
            "utilidades",
            "logs",
            "ctn",
            "maestros",
            "mensajes",
            "realtime",
            "notarios",
            "documentos"
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
        },

        "token": "admin-token"
    }
