from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Cita(Base):
    __tablename__ = "agenda_citas"

    id = Column(Integer, primary_key=True, index=True)

    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    tipo_cita = Column(String, nullable=False)

    notario_id = Column(Integer, ForeignKey("ctn_notarios.id"), nullable=True)
    tipo_firma = Column(String, nullable=True)

    # Apoderado como texto (del Excel)
    apoderado = Column(String(150), nullable=True)

    # Apoderado como relación opcional con empleados
    apoderado_id = Column(Integer, ForeignKey("empleados.id"), nullable=True)
    apoderado_rel = relationship(
        "Empleado",
        back_populates="citas",
        lazy="joined",
    )

    observaciones = Column(String, nullable=True)

    notario = relationship(
        "Notaria",
        back_populates="citas",
        lazy="joined",
    )
