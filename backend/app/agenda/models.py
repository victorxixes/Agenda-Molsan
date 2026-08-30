from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
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

    # 🔥 Coincide con importer CTN (vc = SI/NO)
    vc = Column(String, nullable=True)

    # 🔥 Coincide con service.py y schemas.py
    observacion = Column(String, nullable=True)

    # 🔥 Coincide con importer CTN
    apoderado_s = Column(String, nullable=True)

    # 🔥 Estado de la cita
    estado = Column(String, default="Pendiente")

    # Relaciones
    notario_id = Column(Integer, ForeignKey("ctn_notarios.id"), nullable=True)
    apoderado_id = Column(Integer, ForeignKey("empleados_v2.id"), nullable=True)

    # ORM relations
    notario = relationship("Notaria", back_populates="citas", lazy="joined")
    apoderado = relationship("Empleado", lazy="joined")
