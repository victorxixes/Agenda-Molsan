from sqlalchemy.orm import Session
from backend.app.seguridad.models import Rol

# ---------------------------------------------------------
# CREAR ROL
# ---------------------------------------------------------
def crear_rol(db: Session, data):
    rol = Rol(
        nombre=data.nombre,
        descripcion=data.descripcion
    )

    db.add(rol)
    db.commit()
    db.refresh(rol)

    return rol


# ---------------------------------------------------------
# LISTAR ROLES
# ---------------------------------------------------------
def listar_roles(db: Session):
    return db.query(Rol).all()


# ---------------------------------------------------------
# OBTENER ROL
# ---------------------------------------------------------
def obtener_rol(db: Session, rol_id: int):
    return db.query(Rol).filter(Rol.id == rol_id).first()
