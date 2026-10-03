from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from backend.app.database import Base


class Log(Base):
    """
    Registro de logs técnicos / operativos del ERP.

    IMPORTANTE:
    Se mantiene la estructura actual de la tabla
    `seguridad_logs` para no romper el histórico existente.
    """

    __tablename__ = "seguridad_logs"

    __allow_unmapped__ = True

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    evento = Column(
        String(200),
        nullable=False,
        index=True
    )

    detalle = Column(
        String(1000),
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
        """
        Representación estándar del log para API.
        """

        return {
            "id": self.id,
            "evento": self.evento,
            "detalle": self.detalle,
            "ip": self.ip,
            "fecha": (
                self.fecha.isoformat()
                if self.fecha
                else None
            ),
        }
