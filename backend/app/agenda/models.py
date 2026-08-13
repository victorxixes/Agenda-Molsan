from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from backend.app.database import Base

class Cita(Base):
    __tablename__ = "agenda_citas"
    __allow_unmapped__ = True

class Cita(Base):
    __tablename__ = "agenda_citas"

    id = Column(Integer, primary_key=True, index=True)

    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    tipo_cita = Column(String, nullable=False)

    # Campos opcionales (sin FK)
    notario_id = Column(Integer, nullable=True)
    tipo_firma = Column(String, nullable=True)
    apoderado_id = Column(Integer, nullable=True)
    observaciones = Column(String, nullable=True)

    estado = Column(String, default="Pendiente")
