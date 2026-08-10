from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
from app.database import Base

class Log(Base):
    __tablename__ = "logs"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(Integer, nullable=True)  # puede ser None si es error del sistema
    modulo = Column(String, nullable=False)      # agenda, empleados, mensajes, intranet, seguridad...
    accion = Column(String, nullable=False)      # crear, editar, eliminar, login, error...
    descripcion = Column(String, nullable=False)

    datos = Column(JSON, nullable=True)          # payload opcional
    fecha = Column(DateTime, default=datetime.now)
    nivel = Column(String, default="INFO")       # INFO, WARNING, ERROR

