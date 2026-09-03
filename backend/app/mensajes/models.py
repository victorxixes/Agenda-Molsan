from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Mensaje(Base):
    __tablename__ = "mensajes"
    __allow_unmapped__ = True  # evita errores con SQLAlchemy 2.x

    id = Column(Integer, primary_key=True, index=True)

    remitente_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)
    destinatario_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)

    # Texto del mensaje (puede ser None si es un archivo)
    contenido = Column(String, nullable=True)

    # Archivo adjunto (PDF, Word, imagen…)
    archivo_url = Column(String, nullable=True)

    fecha = Column(DateTime, default=datetime.utcnow)
    leido = Column(Boolean, default=False)

    remitente = relationship("Empleado", foreign_keys=[remitente_id])
    destinatario = relationship("Empleado", foreign_keys=[destinatario_id])

    # ---------------------------------------------------------
    # Representación estándar para WebSocket y REST
    # ---------------------------------------------------------
    def as_dict(self):
        return {
            "id": self.id,
            "remitente_id": self.remitente_id,
            "destinatario_id": self.destinatario_id,
            "contenido": self.contenido,
            "archivo_url": self.archivo_url,
            "fecha": self.fecha.isoformat(),
            "leido": self.leido
        }
