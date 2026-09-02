from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Mensaje(Base):
    __tablename__ = "mensajes"

    id = Column(Integer, primary_key=True, index=True)

    remitente_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)
    destinatario_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)

    contenido = Column(String, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)

    leido = Column(Boolean, default=False)

    remitente = relationship("Empleado", foreign_keys=[remitente_id])
    destinatario = relationship("Empleado", foreign_keys=[destinatario_id])
