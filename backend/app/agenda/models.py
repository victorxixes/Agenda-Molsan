from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from backend.app.database import Base

class Cita(Base):
    __tablename__ = "agenda_citas_2026"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)

    tipo_cita = Column(String, nullable=False, default="Otros")

    notario_id = Column(Integer, ForeignKey("ctn_notarios.id"), nullable=True)

    tipo_firma = Column(String, nullable=True)

    apoderado_id = Column(Integer, ForeignKey("empleados_v2.id"), nullable=True)

    estado = Column(String, nullable=False, default="Pendiente")
    observaciones = Column(String, nullable=True)
