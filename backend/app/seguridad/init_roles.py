
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app.seguridad.models import Rol, Permiso, RolPermiso

ROLES_BASE = [
    {"nombre": "Administrador", "descripcion": "Acceso total al ERP"},
    {"nombre": "Direccion", "descripcion": "Gestión y supervisión"},
    {"nombre": "Apoderado", "descripcion": "Acceso a agenda y firmas"},
    {"nombre": "Gestor", "descripcion": "Acceso limitado"},
    {"nombre": "Invitado", "descripcion": "Acceso mínimo"},
]

PERMISOS_BASE = [
    {"modulo": "agenda", "acciones": "ver,crear,editar,eliminar"},
    {"modulo": "empleados", "acciones": "ver,crear,editar,eliminar"},
    {"modulo": "ctn", "acciones": "ver,crear,editar,eliminar"},
    {"modulo": "dashboard", "acciones": "ver"},
    {"modulo": "seguridad", "acciones": "ver,editar"},
    {"modulo": "auditoria", "acciones": "ver"},
    {"modulo": "sistema", "acciones": "ver"},
    {"modulo": "utilidades", "acciones": "ver"},
    {"modulo": "monitor", "acciones": "ver"},
    {"modulo": "logs", "acciones": "ver"},
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

def init_permisos():
    db: Session = SessionLocal()

    for permiso in PERMISOS_BASE:
        existe = db.query(Permiso).filter(Permiso.modulo == permiso["modulo"]).first()
        if not existe:
            nuevo = Permiso(
                modulo=permiso["modulo"],
                acciones=permiso["acciones"],
            )
            db.add(nuevo)

    db.commit()
    db.close()

def init_roles_permisos():
    db: Session = SessionLocal()

    roles = db.query(Rol).all()
    permisos = db.query(Permiso).all()

    for rol in roles:
        for permiso in permisos:
            existe = db.query(RolPermiso).filter(
                RolPermiso.rol_id == rol.id,
                RolPermiso.permiso_id == permiso.id,
            ).first()

            if rol.nombre == "Administrador":
                if not existe:
                    db.add(RolPermiso(rol_id=rol.id, permiso_id=permiso.id))

            elif rol.nombre == "Direccion":
                acciones = permiso.acciones.split(",")
                if "ver" in acciones or "editar" in acciones:
                    if not existe:
                        db.add(RolPermiso(rol_id=rol.id, permiso_id=permiso.id))

            elif rol.nombre == "Apoderado":
                if permiso.modulo == "agenda":
                    if not existe:
                        db.add(RolPermiso(rol_id=rol.id, permiso_id=permiso.id))

            elif rol.nombre == "Gestor":
                acciones = permiso.acciones.split(",")
                if "ver" in acciones:
                    if not existe:
                        db.add(RolPermiso(rol_id=rol.id, permiso_id=permiso.id))

            elif rol.nombre == "Invitado":
                if permiso.modulo in ["agenda", "empleados"]:
                    acciones = permiso.acciones.split(",")
                    if "ver" in acciones:
                        if not existe:
                            db.add(RolPermiso(rol_id=rol.id, permiso_id=permiso.id))

    db.commit()
    db.close()

def init_seguridad():
    init_roles()
    init_permisos()
    init_roles_permisos()
