from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from backend.app.database import Base

class Cita(Base):
    __tablename__ = "agenda_citas_2026"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    # Fecha y horas de la cita
    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)

    # Tipo de cita (Firma notarial, Reunión, Visita, Otros)
    tipo_cita = Column(String, nullable=False, default="Otros")

    # Notario (solo obligatorio si tipo_cita = Firma notarial)
    # CORREGIDO: la tabla correcta es ctn_notarios
    notario_id = Column(Integer, ForeignKey("ctn_notaria.id"), nullable=True)

    # Tipo de firma (VideoConferencia / Presencial)
    tipo_firma = Column(String, nullable=True)

    # Apoderado asignado (relación con Empleados)
    # CORREGIDO: tu tabla correcta es empleados_v2
    apoderado = Column(Integer, ForeignKey("empleados_v2.id"), nullable=True)

    # Estado de la cita
    estado = Column(String, nullable=False, default="Pendiente")
    # Pendiente, Confirmada, En curso, Finalizada, Cancelada

    # Observaciones del apoderado
    observaciones = Column(String, nullable=True)
