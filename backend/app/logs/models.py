from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime

from backend.app.database import Base


class Log(Base):
    __tablename__ = "logs"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    # Puede ser None si es un error del sistema
    usuario_id = Column(Integer, nullable=True)

    # agenda, empleados, mensajes, intranet, seguridad...
    modulo = Column(String, nullable=False)

    # crear, editar, eliminar, login, error...
    accion = Column(String, nullable=False)

    descripcion = Column(String, nullable=False)

    # payload opcional
    datos = Column(JSON, nullable=True)

    fecha = Column(DateTime, default=datetime.now)

    # INFO, WARNING, ERROR
    nivel = Column(String, default="INFO")
