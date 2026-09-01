import hashlib
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from backend.app.database import get_db
from backend.app.auth.schemas import LoginRequest
from backend.app.auth.service import crear_token, serializar_empleado
from backend.app.empleados.models import Empleado

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

# ---------------------------------------------------------
# LOGIN EMPLEADOS
# ---------------------------------------------------------
@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.usuario == data.usuario).first()

    if not empleado:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    if not pwd_context.verify(data.password, empleado.password):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {
        "id": empleado.id,
        "usuario": empleado.usuario,
        "nombre": empleado.nombre,
        "rol_id": empleado.rol_id
    }



# ---------------------------------------------------------
# LOGIN ADMIN
# ---------------------------------------------------------
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
