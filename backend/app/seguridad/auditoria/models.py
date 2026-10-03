from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from backend.app.database import Base


class Auditoria(Base):
    """
    Registro de auditoría de seguridad.

    IMPORTANTE:
    Se mantiene la estructura actual de la tabla para no romper
    el histórico existente.

    La relación con el empleado se resuelve mediante el campo
    `usuario`, que contiene el login del empleado.
    """

    __tablename__ = "seguridad_auditoria"

    __allow_unmapped__ = True

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    usuario = Column(
        String(100),
        nullable=True,
        index=True
    )

    modulo = Column(
        String(100),
        nullable=True,
        index=True
    )

    accion = Column(
        String(100),
        nullable=True,
        index=True
    )

    descripcion = Column(
        String(500),
        nullable=True
    )

    ip = Column(
        String(50),
        nullable=True
    )

    fecha = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True
    )

    def as_dict(self):
        return {
            "id": self.id,
            "usuario": self.usuario,
            "modulo": self.modulo,
            "accion": self.accion,
            "descripcion": self.descripcion,
            "ip": self.ip,
            "fecha": (
                self.fecha.isoformat()
                if self.fecha
                else None
            ),
        }
