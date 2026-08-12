from sqlalchemy.orm import Session
from backend.app.seguridad.models import Rol, Permiso

def crear_rol(db: Session, data):
    rol = Rol(nombre=data.nombre, descripcion=data.descripcion)
    db.add(rol)
    db.commit()
    db.refresh(rol)

    for p in data.permisos:
        permiso = Permiso(
            rol_id=rol.id,
            modulo=p.modulo,
            acciones=p.acciones
        )
        db.add(permiso)

    db.commit()
    return rol

def listar_roles(db: Session):
    return db.query(Rol).all()

def obtener_permisos_por_rol(db: Session, rol_id: int):
    permisos = db.query(Permiso).filter(Permiso.rol_id == rol_id).all()
    return permisos
