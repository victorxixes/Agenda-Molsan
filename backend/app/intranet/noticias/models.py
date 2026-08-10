from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Noticia(Base):
    __tablename__ = "intranet_noticias"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    fecha_publicacion = Column(DateTime, default=datetime.utcnow)

    # CAMPOS CORRECTOS: titulo + descripcion
    titulo = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)

    fichero = Column(String, nullable=True)

    usuario_id = Column(Integer, ForeignKey("empleados.id"), nullable=True)
