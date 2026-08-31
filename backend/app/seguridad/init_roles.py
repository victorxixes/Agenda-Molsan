from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app.seguridad.models import Rol

ROLES_BASE = [
    {"nombre": "Administrador", "descripcion": "Acceso total al ERP"},
    {"nombre": "Direccion", "descripcion": "Gestión y supervisión"},
    {"nombre": "Apoderado", "descripcion": "Acceso a agenda y firmas"},
    {"nombre": "Gestor", "descripcion": "Acceso limitado"},
    {"nombre": "Invitado", "descripcion": "Acceso mínimo"},
]

def init_roles():
    db: Session = SessionLocal()

    for rol in ROLES_BASE:
        existe = db.query(Rol).filter(Rol.nombre == rol["nombre"]).first()
        if not existe:
            nuevo = Rol(**rol)
            db.add(nuevo)

    db.commit()
    db.close()

def init_seguridad():
    init_roles()
