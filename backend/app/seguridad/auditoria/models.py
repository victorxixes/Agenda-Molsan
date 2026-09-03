from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from backend.app.database import Base

class Auditoria(Base):
    __tablename__ = "seguridad_auditoria"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    usuario = Column(String(100), nullable=True)
    modulo = Column(String(100), nullable=True)
    accion = Column(String(100), nullable=True)
    descripcion = Column(String(500), nullable=True)
    ip = Column(String(50), nullable=True)

    fecha = Column(DateTime, default=datetime.utcnow)

    # Representación estándar ERP‑2026
    def as_dict(self):
        return {
            "id": self.id,
            "usuario": self.usuario,
            "modulo": self.modulo,
            "accion": self.accion,
            "descripcion": self.descripcion,
            "ip": self.ip,
            "fecha": self.fecha.isoformat()
        }
