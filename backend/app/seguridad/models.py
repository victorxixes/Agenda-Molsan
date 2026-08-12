from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.database import Base

class Rol(Base):
    __tablename__ = "roles2"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True)
    descripcion = Column(String, nullable=True)

    permisos = relationship("Permiso", back_populates="rol", cascade="all, delete")

class Permiso(Base):
    __tablename__ = "permisos2"

    id = Column(Integer, primary_key=True, index=True)
    rol_id = Column(Integer, ForeignKey("roles2.id"))
    modulo = Column(String)
    acciones = Column(String)  # Ej: "ver,crear,editar,eliminar"

    rol = relationship("Rol", back_populates="permisos")

class RolPermiso(Base):
    __tablename__ = "roles_permisos2"

    id = Column(Integer, primary_key=True, index=True)
    rol_id = Column(Integer, ForeignKey("roles2.id"))
    permiso_id = Column(Integer, ForeignKey("permisos2.id"))
