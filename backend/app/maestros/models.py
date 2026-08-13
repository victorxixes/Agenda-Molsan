from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String

from backend.app.database import Base


class Departamento(Base):
    __tablename__ = "departamentos"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)
    descripcion = Column(String, nullable=True)

    empleados = relationship("Empleado", back_populates="departamento")


class Seccion(Base):
    __tablename__ = "secciones"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)
    descripcion = Column(String, nullable=True)

    empleados = relationship("Empleado", back_populates="seccion")


class Cargo(Base):
    __tablename__ = "cargos"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)
    descripcion = Column(String, nullable=True)

    empleados = relationship("Empleado", back_populates="cargo")
