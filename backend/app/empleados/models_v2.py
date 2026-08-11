from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base

class EmpleadoV2(Base):
    __tablename__ = "empleados_v2"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=True)
    dni = Column(String(20), unique=True, nullable=True)
    usuario = Column(String(100), nullable=True)
    password = Column(String(255), nullable=True)
    activo = Column(Boolean, default=True)
