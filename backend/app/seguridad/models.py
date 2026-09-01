from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.app.database import Base

# ---------------------------------------------------------
# ROLES COMPLETOS
# ---------------------------------------------------------
class Rol(Base):
    __tablename__ = "roles"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)
    descripcion = Column(String, nullable=True)

    # 🔥 Permisos por módulo (JSON)
    permisos_modulo_dict = Column(JSON, default=dict)

    # 🔥 Módulos visibles del rol (JSON)
    modulos_visibles_list = Column(JSON, default=list)

    # 🔥 Relación con empleados
    empleados = relationship("Empleado", back_populates="rol")


# ---------------------------------------------------------
# EVENTOS DE SEGURIDAD
# ---------------------------------------------------------
class EventoSeguridad(Base):
    __tablename__ = "eventos_seguridad"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, index=True)
    usuario_id = Column(Integer, index=True)
    detalle = Column(String, default="")
    ip = Column(String, default="")
    user_agent = Column(String, default="")
    creado_en = Column(DateTime, default=datetime.utcnow)


# ---------------------------------------------------------
# AUDITORÍA GENERAL
# ---------------------------------------------------------
class Auditoria(Base):
    __tablename__ = "auditoria_seguridad"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, index=True)
    modulo = Column(String)
    accion = Column(String)
    datos = Column(JSON, default={})
    creado_en = Column(DateTime, default=datetime.utcnow)
