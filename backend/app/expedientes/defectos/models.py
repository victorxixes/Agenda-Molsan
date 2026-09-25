from sqlalchemy import Column, Integer, String, Date, ForeignKey
from backend.app.database import Base

class ExpedienteDefecto(Base):
    __tablename__ = "expediente_defectos"

    id = Column(Integer, primary_key=True)

    # Relación con expediente
    expediente_id = Column(Integer, ForeignKey("expedientes.id"))

    # Estado del defecto
    tiene_defectos_abiertos = Column(String(10))   # SI / NO

    # Tipo de error
    tipo_error = Column(String(300))

    # Descripción del error
    descripcion_error = Column(String(1000))

    # Qué falta para resolver el defecto
    falta_defecto = Column(String(500))

    # Fecha de cierre del defecto
    fecha_cierre_defecto = Column(Date)
