from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from datetime import datetime

from backend.app.database import Base


class Mensaje(Base):
    __tablename__ = "mensajes"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    # ✔ La tabla correcta es empleados
    remitente_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)
    destinatario_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)

    mensaje = Column(String, nullable=False)

    fecha = Column(DateTime, default=datetime.utcnow)
    leido = Column(Boolean, default=False)


class UsuarioEstado(Base):
    __tablename__ = "mensajes_usuarios_estado"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    # ✔ La tabla correcta es empleados
    usuario_id = Column(Integer, ForeignKey("empleados.id"), nullable=False)

    conectado = Column(Boolean, default=False)
    ultima_actividad = Column(DateTime, default=datetime.utcnow)
