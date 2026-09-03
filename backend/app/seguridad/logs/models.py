from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from backend.app.database import Base

class Log(Base):
    __tablename__ = "seguridad_logs"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    evento = Column(String(200), nullable=False)
    detalle = Column(String(1000), nullable=True)
    ip = Column(String(50), nullable=True)

    fecha = Column(DateTime, default=datetime.utcnow)

    # Representación estándar ERP‑2026
    def as_dict(self):
        return {
            "id": self.id,
            "evento": self.evento,
            "detalle": self.detalle,
            "ip": self.ip,
            "fecha": self.fecha.isoformat()
        }
