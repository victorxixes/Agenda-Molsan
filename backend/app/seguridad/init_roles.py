from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app.seguridad.models import Rol
import json

# ---------------------------------------------------------
# ROLES BASE
# ---------------------------------------------------------
ROLES_BASE = [
    {
        "nombre": "Administrador",
        "descripcion": "Acceso total al ERP",
        "modulos_visibles_list": [
            "dashboard", "agenda", "empleados", "ctn",
            "documentos", "intranet", "mensajes", "seguridad"
        ],
        "permisos_modulo_dict": {
            "*": ["ver", "crear", "editar", "eliminar"],
            "dashboard": ["ver"],
            "agenda": ["ver", "crear", "editar", "eliminar"],
            "empleados": ["ver", "crear", "editar", "eliminar"],
            "ctn": ["ver", "crear", "editar", "eliminar"],
            "documentos": ["ver", "crear", "editar", "eliminar"],
            "intranet": ["ver", "crear", "editar", "eliminar"],
            "mensajes": ["ver", "crear", "editar", "eliminar"],
            "seguridad": ["ver", "crear", "editar", "eliminar"],
        }
    },
    {
        "nombre": "Direccion",
        "descripcion": "Gestión y supervisión",
        "modulos_visibles_list": [
            "dashboard", "agenda", "empleados", "documentos", "mensajes"
        ],
        "permisos_modulo_dict": {
            "dashboard": ["ver"],
            "agenda": ["ver", "editar"],
            "empleados": ["ver"],
            "documentos": ["ver", "crear"],
            "mensajes": ["ver", "crear"],
        }
    },
    {
        "nombre": "Apoderado",
        "descripcion": "Acceso a agenda y firmas",
        "modulos_visibles_list": ["agenda", "mensajes"],
        "permisos_modulo_dict": {
            "agenda": ["ver", "crear"],
            "mensajes": ["ver", "crear"],
        }
    },
    {
        "nombre": "Gestor",
        "descripcion": "Acceso limitado",
        "modulos_visibles_list": ["agenda", "documentos"],
        "permisos_modulo_dict": {
            "agenda": ["ver"],
            "documentos": ["ver"],
        }
    },
    {
        "nombre": "Invitado",
        "descripcion": "Acceso mínimo",
        "modulos_visibles_list": ["intranet"],
        "permisos_modulo_dict": {
            "intranet": ["ver"],
        }
    },
]

# ---------------------------------------------------------
# INICIALIZAR ROLES
# ---------------------------------------------------------
def init_roles():
    db: Session = SessionLocal()

    for rol_data in ROLES_BASE:

        mv = rol_data["modulos_visibles_list"]
        if isinstance(mv, str):
            try:
                mv = json.loads(mv)
            except:
                mv = []

        pm = rol_data["permisos_modulo_dict"]
        if isinstance(pm, str):
            try:
                pm = json.loads(pm)
            except:
                pm = {}

        existe = db.query(Rol).filter(Rol.nombre == rol_data["nombre"]).first()

        if not existe:
            nuevo = Rol(
                nombre=rol_data["nombre"],
                descripcion=rol_data["descripcion"],
                modulos_visibles_list=mv,
                permisos_modulo_dict=pm
            )
            db.add(nuevo)

    db.commit()
    db.close()


def init_seguridad():
    init_roles()
