from sqlalchemy import Column, Integer, String, Date, Time
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Cita(Base):
    __tablename__ = "agenda_citas"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    tipo_cita = Column(String, nullable=False)

    vc = Column(String, nullable=True)
    observacion = Column(String, nullable=True)
    apoderado_s = Column(String, nullable=True)
    estado = Column(String, default="Pendiente")
