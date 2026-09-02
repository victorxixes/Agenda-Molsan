from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from backend.app.database import Base


class Documento(Base):
    __tablename__ = "intranet_documentos"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    fecha_publicacion = Column(DateTime, default=datetime.utcnow)
    titulo = Column(String, nullable=False)

    concepto = Column(String, nullable=True)

    fichero = Column(String, nullable=False)

    # CORREGIDO: la tabla correcta es empleados
    usuario_id = Column(Integer, ForeignKey("empleados.id"), nullable=True)
