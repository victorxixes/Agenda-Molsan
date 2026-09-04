from sqlalchemy.orm import Session
import hashlib

from backend.app.empleados.models import Empleado
from backend.app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
from backend.app.auth.service import crear_token, serializar_empleado


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def login_empleado(db: Session, usuario: str, password: str):
    empleado = db.query(Empleado).filter(Empleado.usuario == usuario).first()

    if empleado is None:
        return None

    # Comprobar si está activo
    if hasattr(empleado, "activo") and empleado.activo is False:
        return None

    # Comparar hash
    if empleado.password != hash_password(password):
        return None

    # Crear token JWT
    token = crear_token(empleado)

    # Serializar empleado (estructura completa para el ERP)
    empleado_serializado = serializar_empleado(empleado)

    return {
        "empleado": empleado_serializado,
        "token": token
    }


def obtener_empleado(db: Session, empleado_id: int):
    return db.query(Empleado).filter(Empleado.id == empleado_id).first()


def obtener_empleado_por_usuario(db: Session, usuario: str):
    return db.query(Empleado).filter(Empleado.usuario == usuario).first()


def crear_empleado(db: Session, data: EmpleadoCreate):
    if obtener_empleado_por_usuario(db, data.usuario):
        raise ValueError("El usuario ya existe")

    empleado = Empleado(
        nombre=data.nombre,
        dni=data.dni,
        usuario=data.usuario,
        password=hash_password(data.password),
        activo=True,
        modulos_visibles_list=[],
        permisos_modulo_dict={}
    )

    db.add(empleado)
    db.commit()
    db.refresh(empleado)
    return empleado


def listar_empleados(db: Session, q: str | None = None, activo: bool | None = None):
    query = db.query(Empleado)

    # Filtro por texto (nombre, usuario, DNI)
    if q:
        q_like = f"%{q}%"
        query = query.filter(
            (Empleado.nombre.ilike(q_like)) |
            (Empleado.usuario.ilike(q_like)) |
            (Empleado.dni.ilike(q_like))
        )

    # Filtro por activo/inactivo
    if activo is not None:
        query = query.filter(Empleado.activo == activo)

    return query.order_by(Empleado.id.asc()).all()


def editar_empleado(db: Session, empleado_id: int, data: EmpleadoUpdate):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return None

    for campo, valor in data.dict(exclude_unset=True).items():
        if campo == "password":
            empleado.password = hash_password(valor)
        else:
            setattr(empleado, campo, valor)

    db.commit()
    db.refresh(empleado)
    return empleado


def eliminar_empleado(db: Session, empleado_id: int):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return False

    db.delete(empleado)
    db.commit()
    return True


# -------------------------
# NUEVO: actualizar módulos visibles
# -------------------------
def actualizar_modulos_visibles(db: Session, empleado_id: int, modulos: list):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return None

    empleado.modulos_visibles_list = modulos
    db.commit()
    db.refresh(empleado)
    return empleado


# -------------------------
# NUEVO: actualizar permisos por módulo
# -------------------------
def actualizar_permisos_modulo(db: Session, empleado_id: int, permisos: dict):
    empleado = obtener_empleado(db, empleado_id)
    if not empleado:
        return None

    empleado.permisos_modulo_dict = permisos
    db.commit()
    db.refresh(empleado)
    return empleado


# -------------------------
# OPCIONAL: crear admin por defecto en la BD
# -------------------------
def crear_admin_por_defecto(db: Session):
    """
    Llamar manualmente (por ejemplo, desde un script de inicialización)
    para garantizar que exista el usuario 'admin' en la tabla empleados.
    """
    if obtener_empleado_por_usuario(db, "admin"):
        return

    admin = Empleado(
        nombre="Administrador",
        apellidos="",
        dni="",
        usuario="admin",
        password=hash_password("admin"),
        activo=True,
        foto="default-avatar.png",
        rol_id=0,
        modulos_visibles_list=[
            "dashboard", "agenda", "empleados", "informes", "intranet",
            "auditoria", "seguridad", "utilidades", "logs", "ctn",
            "maestros", "mensajes", "realtime", "notarios", "documentos"
        ],
        permisos_modulo_dict={
            "*": ["ver", "crear", "editar", "eliminar"]
        }
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin
