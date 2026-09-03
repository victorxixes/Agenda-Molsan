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

    vc = Column(String, nullable=True)
    observacion = Column(String, nullable=True)
    apoderado_s = Column(String, nullable=True)

    # Relaciones reales
    notario_id = Column(Integer, ForeignKey("ctn_notarios.id"), nullable=True)
    apoderado_id = Column(Integer, ForeignKey("empleados.id"), nullable=True)

    # ORM
    notario = relationship(
        "Notaria",
        back_populates="citas",
        lazy="joined"
    )

    apoderado = relationship(
        "Empleado",
        back_populates="citas",
        lazy="joined"
    )
