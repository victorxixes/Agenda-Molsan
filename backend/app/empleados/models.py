from sqlalchemy import Column, Integer, String, Boolean, JSON
from app.database import Base

class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String)
    apellidos = Column(String)
    dni = Column(String)
    telefono = Column(String)
    email_personal = Column(String)
    email_empresa = Column(String)
    extension = Column(String)
    usuario = Column(String)
    password = Column(String)

    direccion = Column(String)
    fecha_nacimiento = Column(String)
    alergias = Column(String)
    persona_contacto = Column(String)
    telefono_contacto = Column(String)
    observaciones = Column(String)
    foto = Column(String)

    departamento_id = Column(Integer)
    seccion_id = Column(Integer)
    cargo_id = Column(Integer)
    rol_id = Column(Integer)

    fecha_alta = Column(String)
    fecha_baja = Column(String)
    activo = Column(Boolean, default=True)

    modulos_visibles_list = Column(JSON)
    permisos_modulo_dict = Column(JSON)
