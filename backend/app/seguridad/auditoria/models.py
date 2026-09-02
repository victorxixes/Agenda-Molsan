from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from backend.app.database import Base


class Auditoria(Base):
    __tablename__ = "auditoria2"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    usuario = Column(String, nullable=True)
    modulo = Column(String, nullable=True)
    accion = Column(String, nullable=True)
    descripcion = Column(String, nullable=True)

    fecha = Column(DateTime, default=datetime.utcnow)

    # IP del usuario o del sistema
    ip = Column(String(50), nullable=True)
