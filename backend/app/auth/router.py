import hashlib
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.auth.schemas import LoginRequest
from backend.app.empleados.service import login as login_service

router = APIRouter(prefix="/auth", tags=["Auth"])


# ---------------------------------------------------------
# LOGIN EMPLEADOS
# ---------------------------------------------------------
@router.post("/login")
def login_empleado(data: LoginRequest, db: Session = Depends(get_db)):
    resultado = login_service(db, data.usuario, data.password)

    empleado = resultado["empleado"]   # ← es un modelo SQLAlchemy
    token = resultado["token"]

    return {
        "empleado_id": empleado.id,
        "nombre": empleado.nombre,
        "foto": empleado.foto,

        "rol_id": empleado.rol_id,
        "rol_nombre": empleado.rol.nombre if empleado.rol else None,

        "modulos_visibles": empleado.modulos_visibles or [],
        "permisos_modulo": empleado.permisos_modulo or {},

        "token": token
    }


@router.post("/login/")
def login_empleado_slash(data: LoginRequest, db: Session = Depends(get_db)):
    return login_empleado(data, db)


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

    return {
        "empleado_id": 1,
        "nombre": "Administrador",
        "foto": "https://agenda-intranet-b.onrender.com/static/avatar.png",

        # 🔥 Seguridad unificada
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
