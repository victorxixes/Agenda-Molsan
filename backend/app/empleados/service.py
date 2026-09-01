from sqlalchemy.orm import Session
from backend.app.empleados.models import Empleado
from backend.app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate
from backend.app.seguridad.models import Rol
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")


# ---------------------------------------------------------
# CREAR EMPLEADO
# ---------------------------------------------------------
def crear_empleado(db: Session, data: EmpleadoCreate):

    hashed_password = pwd_context.hash(data.password[:72]) if data.password else None

    empleado = Empleado(
        nombre=data.nombre,
        apellidos=data.apellidos,
        dni=data.dni,
        telefono=data.telefono,
        email_personal=data.email_personal,
        direccion=data.direccion,
        fecha_nacimiento=data.fecha_nacimiento,
        alergias=data.alergias,
        persona_contacto=data.persona_contacto,
        telefono_contacto=data.telefono_contacto,
        observaciones=data.observaciones,
        departamento_id=data.departamento_id,
        seccion_id=data.seccion_id,
        cargo_id=data.cargo_id,
        email_empresa=data.email_empresa,
        extension=data.extension,
        fecha_alta=data.fecha_alta,
        fecha_baja=data.fecha_baja,
        activo=data.activo,
        usuario=data.usuario,
        password=hashed_password,
        foto=data.foto,
        rol_id=data.rol_id,
    )

    empleado.modulos_visibles_list = data.modulos_visibles or []
    empleado.permisos_modulo_dict = data.permisos_modulo or {}

    db.add(empleado)
    db.commit()
    db.refresh(empleado)

    return empleado


# ---------------------------------------------------------
# EDITAR EMPLEADO
# ---------------------------------------------------------
def editar_empleado(db: Session, empleado_id: int, data: EmpleadoUpdate):

    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return None

    for campo, valor in data.dict(exclude_unset=True).items():
        if campo in ["modulos_visibles", "permisos_modulo"]:
            continue
        setattr(empleado, campo, valor)

    if data.modulos_visibles is not None:
        empleado.modulos_visibles_list = data.modulos_visibles

    if data.permisos_modulo is not None:
        empleado.permisos_modulo_dict = data.permisos_modulo

    db.commit()
    db.refresh(empleado)

    return empleado


# ---------------------------------------------------------
# ELIMINAR EMPLEADO
# ---------------------------------------------------------
def eliminar_empleado(db: Session, empleado_id: int):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        return False

    db.delete(empleado)
    db.commit()
    return True


# ---------------------------------------------------------
# LISTAR EMPLEADOS
# ---------------------------------------------------------
def listar_empleados(db: Session):
    return db.query(Empleado).all()


# ---------------------------------------------------------
# OBTENER EMPLEADO
# ---------------------------------------------------------
def obtener_empleado(db: Session, empleado_id: int):
    return db.query(Empleado).filter(Empleado.id == empleado_id).first()
