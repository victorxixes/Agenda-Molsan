from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from backend.app.database import Base


class Expediente(Base):
    __tablename__ = "expedientes"

    id = Column(Integer, primary_key=True)

    # ============================================================
    # RELACIÓN CON CLIENTE
    # ============================================================

    cliente_id = Column(
        Integer,
        ForeignKey("clientes.id"),
        nullable=True,
        index=True,
    )

    # ============================================================
    # IDENTIFICACIÓN
    # ============================================================

    id_expediente = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    # ============================================================
    # ESTADO
    # ============================================================

    estado_expediente = Column(String(200))
    estado_expediente_ancert = Column(String(200))

    # ============================================================
    # FECHAS
    # ============================================================

    fecha_alta = Column(Date)
    fecha_firma = Column(Date)
    fecha_inscripcion = Column(Date)
    fecha_entregado_cliente = Column(Date)
    fecha_prevista_firma = Column(Date)
    fecha_vencimiento = Column(Date)

    fecha_sol_cgn = Column(Date)

    fecha_firma_prev_val = Column(Date)
    fecha_firma_prev_cli = Column(Date)

    fecha_inicio_actividad = Column(Date)
    fecha_fin_actividad = Column(Date)

    # ============================================================
    # ACTIVIDAD
    # ============================================================

    actividad_actual = Column(String(300))
    estado_actividad = Column(String(200))

    # ============================================================
    # SOLICITANTE
    # ============================================================

    nombresolicitante = Column(String(300))
    nifs solicitante = Column(String(50))
