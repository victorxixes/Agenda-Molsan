from sqlalchemy import Column, Integer, String, Date, ForeignKey
from backend.app.database import Base

class ExpedienteActividad(Base):
    __tablename__ = "expediente_actividades"

    id = Column(Integer, primary_key=True)

    # Relación con expediente
    expediente_id = Column(Integer, ForeignKey("expedientes.id"))

    # Nombre de la actividad (APERTURA, NOTARIO, REGISTRAL, FACTURACIÓN, etc.)
    actividad = Column(String(200))

    # Estado de la actividad (PENDIENTE, EN PROCESO, COMPLETADA, BLOQUEADA, etc.)
    estado = Column(String(200))

    # Fechas de la actividad
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)

    # Observaciones específicas de la actividad
    observaciones = Column(String(1000))
