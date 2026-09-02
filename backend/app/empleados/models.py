from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from backend.app.database import Base

class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)

    # Datos básicos
    nombre = Column(String)
    apellidos = Column(String)
    dni = Column(String)
    telefono = Column(String)
    email_personal = Column(String)
    email_empresa = Column(String)
    extension = Column(String)
    usuario = Column(String, unique=True)
    password = Column(String)

    # Datos personales
    direccion = Column(String)
    codigo_postal = Column(String)
    poblacion = Column(String)
    provincia = Column(String)
    fecha_nacimiento = Column(String)
    alergias = Column(String)
    persona_contacto = Column(String)
    telefono_contacto = Column(String)
    observaciones = Column(String)
    foto = Column(String)

    # Datos laborales
    departamento_id = Column(Integer)
    seccion_id = Column(Integer)
    cargo_id = Column(Integer)
    rol_id = Column(Integer)

    # Estado
    fecha_alta = Column(String)
    fecha_baja = Column(String)
    activo = Column(Boolean, default=True)

    # Seguridad interna (🔥 PostgreSQL JSONB)
    modulos_visibles_list = Column(JSONB, default=list)
    permisos_modulo_dict = Column(JSONB, default=dict)

    permisos_modulo_dict = Column(JSON)
