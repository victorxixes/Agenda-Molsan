from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from backend.app.database import Base


class Log(Base):
    __tablename__ = "seguridad_logs"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    evento = Column(String, nullable=False)
    detalle = Column(String, nullable=True)
    ip = Column(String(50), nullable=True)

    fecha = Column(DateTime, default=datetime.utcnow)
