from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Rol(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True)
    descripcion = Column(String)

    # Relación inversa con empleados
    empleados = relationship("Empleado", back_populates="rol")
