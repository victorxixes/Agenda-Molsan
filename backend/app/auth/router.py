import hashlib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Autenticación"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# ---------------------------------------------------------
# LOGIN EMPLEADOS
# ---------------------------------------------------------
@router.post("/login")
def login_empleado(usuario: str, password: str, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.usuario == usuario).first()

    if not empleado:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if empleado.password != hash_password(password):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    token = create_access_token({"empleado_id": empleado.id})

    return {
        "empleado_id": empleado.id,
        "nombre": empleado.nombre,
        "foto": empleado.foto,
        "modulos": empleado.modulos_visibles,
        "permisos": empleado.permisos_modulo,
        "token": token
    }

class LoginRequest(BaseModel):
    usuario: str
    password: str

@router.options("/login")
def options_login():
    return {}

@router.post("/login")
def login(data: LoginRequest):
    # Usuario y contraseña fijos: admin / admin
    if data.usuario != "admin":
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    if hash_password(data.password) != hash_password("admin"):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    # Respuesta adaptada al frontend
    return {
        "id": 1,
        "nombre": "Administrador",
        "avatar_url": "https://agenda-intranet-b.onrender.com/static/avatar.png",

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

        "rol": "admin"
    }
