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
    # ESTADOS
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
    nifsoclicitante = Column(String(50))

    # ============================================================
    # TITULAR
    # ============================================================

    nombre_titular = Column(String(300))
    nif_titular = Column(String(50))

    # ============================================================
    # APODERADO
    # ============================================================

    apoderado = Column(String(300))

    # ============================================================
    # NOTARIO
    # ============================================================

    nombre_notario = Column(String(300))
    nif_notario = Column(String(50))
    notario = Column(String(300))

    # ============================================================
    # OFICINA
    # ============================================================

    oficina = Column(String(200))
    oficina_alta = Column(String(200))
    dan = Column(String(200))

    # ============================================================
    # ECONÓMICOS
    # ============================================================

    capital = Column(Float)
    importe = Column(Float)
    saldo_real = Column(Float)
    saldo_disponible = Column(Float)

    # ============================================================
    # OPERACIÓN
    # ============================================================

    contrato = Column(String(300))
    num_solicitud_sia = Column(String(200))

    tipo_operacion = Column(String(300))
    subtipo_operacion = Column(String(300))

    vinccanc = Column(String(200))
    protocolo = Column(String(200))

    # ============================================================
    # PROVISIÓN
    # ============================================================

    id_provision = Column(String(200))
    tipo_provision = Column(String(200))

    # ============================================================
    # GTG / BANKIA
    # ============================================================

    origen_bankia = Column(String(200))
    producto_gtg = Column(String(300))
    dt = Column(String(200))

    # ============================================================
    # GESTORÍA
    # ============================================================

    id_gestoria_tramite = Column(String(200))
    nombre_gestoria = Column(String(500))

    # Alias interno existente
    gestoria = Column(String(500))

    # ============================================================
    # REGISTRAL / FINCA
    # ============================================================

    finca = Column(String(200))

    # ============================================================
    # DEFECTOS
    # ============================================================

    tiene_defectos_abiertos = Column(String(50))
    tipo_error = Column(String(300))
    descripcion_error = Column(String(1000))
    falta_defecto = Column(String(1000))
    fecha_cierre_defecto = Column(Date)

    # ============================================================
    # CGN
    # ============================================================

    id_expediente_cgn = Column(String(200))

    # ============================================================
    # ACTA
    # ============================================================

    tipo_acta = Column(String(300))

    # ============================================================
    # OTROS
    # ============================================================

    lucy = Column(String(200))
    indicador_tt = Column(String(200))

    # ============================================================
    # OBSERVACIONES
    # ============================================================

    observaciones = Column(String(2000))

    # ============================================================
    # FACTURACIÓN
    # ============================================================

    facturacion_estado = Column(String(200))
    facturacion_fecha = Column(Date)

    # ============================================================
    # REGISTRAL
    # ============================================================

    registral_estado = Column(String(200))
    registral_fecha = Column(Date)
