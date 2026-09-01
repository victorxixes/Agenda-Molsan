from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime

from backend.app.database import Base

class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(100), nullable=True)
    apellidos = Column(String(150), nullable=True)
    dni = Column(String(20), unique=True, nullable=True)
    telefono = Column(String(20), nullable=True)
    email_personal = Column(String(150), nullable=True)
    direccion = Column(String(255), nullable=True)
    fecha_nacimiento = Column(String(20), nullable=True)

    alergias = Column(Text, nullable=True)
    persona_contacto = Column(String(150), nullable=True)
    telefono_contacto = Column(String(20), nullable=True)
    observaciones = Column(Text, nullable=True)

    departamento_id = Column(Integer, ForeignKey("departamentos.id"), nullable=True)
    seccion_id = Column(Integer, ForeignKey("secciones.id"), nullable=True)
    cargo_id = Column(Integer, ForeignKey("cargos.id"), nullable=True)

    departamento = relationship("Departamento", back_populates="empleados")
    seccion = relationship("Seccion", back_populates="empleados")
    cargo = relationship("Cargo", back_populates="empleados")

    email_empresa = Column(String(150), nullable=True)
    extension = Column(String(20), nullable=True)
    fecha_alta = Column(String(20), nullable=True)
    fecha_baja = Column(String(20), nullable=True)

    activo = Column(Boolean, default=True)

    usuario = Column(String(100), unique=True, nullable=True)
    password = Column(String(255), nullable=True)

    foto = Column(String(255), nullable=True)

    rol_id = Column(Integer, ForeignKey("roles.id"), nullable=True)
    rol = relationship("Rol", back_populates="empleados")

    modulos_visibles_list = Column(JSONB, nullable=True, default=list)
    permisos_modulo_dict = Column(JSONB, nullable=True, default=dict)

    creado_en = Column(DateTime, default=datetime.utcnow)
