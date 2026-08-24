from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

# ---------------------------------------------------------
# DEPARTAMENTOS
# ---------------------------------------------------------

class Departamento(Base):
    __tablename__ = "departamentos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)

    empleados = relationship("Empleado", back_populates="departamento")


# ---------------------------------------------------------
# SECCIONES
# ---------------------------------------------------------

class Seccion(Base):
    __tablename__ = "secciones"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)

    empleados = relationship("Empleado", back_populates="seccion")


# ---------------------------------------------------------
# CARGOS
# ---------------------------------------------------------

class Cargo(Base):
    __tablename__ = "cargos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)

    empleados = relationship("Empleado", back_populates="cargo")
