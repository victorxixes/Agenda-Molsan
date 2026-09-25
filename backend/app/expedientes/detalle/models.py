from sqlalchemy import Column, Integer, String, ForeignKey
from backend.app.database import Base

class ExpedienteDetalle(Base):
    __tablename__ = "expediente_detalle"

    id = Column(Integer, primary_key=True)

    expediente_id = Column(Integer, ForeignKey("expedientes.id"))

    campo = Column(String(200))        # nombre de la columna del Excel
    valor = Column(String(2000))       # valor de la celda
