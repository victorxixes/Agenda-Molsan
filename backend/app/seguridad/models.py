from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.app.database import Base

# ---------------------------------------------------------
# ROLES
# ---------------------------------------------------------
class Rol(Base):
    __tablename__ = "roles2"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True)
    descripcion = Column(String, nullable=True)

    # Relación con permisos
    permisos = relationship("Permiso", back_populates="rol", cascade="all, delete")


# ---------------------------------------------------------
# PERMISOS POR MÓDULO
# ---------------------------------------------------------
class Permiso(Base):
    __tablename__ = "permisos2"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    rol_id = Column(Integer, ForeignKey("roles2.id"))
    modulo = Column(String)              # Ej: "empleados"
    acciones = Column(String)            # Ej: "ver,crear,editar,eliminar"

    rol = relationship("Rol", back_populates="permisos")


# ---------------------------------------------------------
# RELACIÓN ROL-PERMISO (si la necesitas)
# ---------------------------------------------------------
class RolPermiso(Base):
    __tablename__ = "roles_permisos2"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    rol_id = Column(Integer, ForeignKey("roles2.id"))
    permiso_id = Column(Integer, ForeignKey("permisos2.id"))


# ---------------------------------------------------------
# EVENTOS DE SEGURIDAD (login, logout, errores, accesos)
# ---------------------------------------------------------
class EventoSeguridad(Base):
    __tablename__ = "eventos_seguridad"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, index=True)          # login, logout, permiso_denegado, error
    usuario_id = Column(Integer, index=True)
    detalle = Column(String, default="")
    ip = Column(String, default="")
    user_agent = Column(String, default="")
    creado_en = Column(DateTime, default=datetime.utcnow)


# ---------------------------------------------------------
# AUDITORÍA GENERAL (acciones del ERP)
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
