from sqlalchemy import Column, Integer, String, Date, Time
from backend.app.database import Base

class Cita(Base):
    __tablename__ = "agenda_citas"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    tipo_cita = Column(String, nullable=False)

    # Campos opcionales
    notario_id = Column(Integer, nullable=True)
    tipo_firma = Column(String, nullable=True)

    # 🔴 ANTES:
    # apoderado = Column(String, nullable=True)
    # 🔵 AHORA: coherente con la tabla
    apoderado_id = Column(Integer, nullable=True)

    observaciones = Column(String, nullable=True)

    estado = Column(String, default="Pendiente")

    def to_dict(self):
        return {
            "id": self.id,
            "fecha": self.fecha.isoformat() if self.fecha else None,
            "hora_inicio": self.hora_inicio.strftime("%H:%M") if self.hora_inicio else None,
            "hora_fin": self.hora_fin.strftime("%H:%M") if self.hora_fin else None,
            "tipo_cita": self.tipo_cita,
            "tipo_firma": self.tipo_firma,
            "estado": self.estado,
            "notario_id": self.notario_id,
            # 🔵 coherente con el modelo y la tabla
            "apoderado_id": self.apoderado_id,
            "observaciones": self.observaciones,
        }
