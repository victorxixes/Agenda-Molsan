from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from backend.app.database import Base


# ============================================================
# SEGURIDAD — LOGS MODEL
# MOLSAN ERP SAAS PREMIUM 2027
# ============================================================


class Log(Base):
    """
    Registro técnico de eventos del sistema.

    IMPORTANTE:
    ------------------------------------------------------------
    Esta tabla está orientada a LOGS TÉCNICOS.

    NO sustituye a seguridad_auditoria.

    Auditoría:
        Quién hizo qué dentro del ERP.

    Logs:
        Qué ocurrió técnicamente en el sistema.
    """

    __tablename__ = "seguridad_logs"

    __allow_unmapped__ = True

    # --------------------------------------------------------
    # ID
    # --------------------------------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # --------------------------------------------------------
    # EVENTO
    # --------------------------------------------------------

    evento = Column(
        String(200),
        nullable=False,
        index=True,
    )

    # --------------------------------------------------------
    # DETALLE
    # --------------------------------------------------------

    detalle = Column(
        String(1000),
        nullable=True,
    )

    # --------------------------------------------------------
    # IP
    # --------------------------------------------------------

    ip = Column(
        String(50),
        nullable=True,
        index=True,
    )

    # --------------------------------------------------------
    # FECHA
    # --------------------------------------------------------

    fecha = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    # --------------------------------------------------------
    # REPRESENTACIÓN
    # --------------------------------------------------------

    def as_dict(self):
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
