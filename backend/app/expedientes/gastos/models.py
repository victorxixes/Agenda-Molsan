from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from backend.app.database import Base

class ExpedienteGasto(Base):
    __tablename__ = "expediente_gastos"

    id = Column(Integer, primary_key=True)

    # Relación con expediente
    expediente_id = Column(Integer, ForeignKey("expedientes.id"))

    # Tipo de gasto (notaría, registro, gestoría, tasación, otros)
    tipo = Column(String(200))

    # Descripción del gasto
    descripcion = Column(String(500))

    # Importe del gasto
    importe = Column(Float)

    # Fecha del gasto
    fecha = Column(Date)

    # Documento asociado (PDF, imagen, etc.)
    documento_url = Column(String(500))
