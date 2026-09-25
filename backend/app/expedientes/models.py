from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from backend.app.database import Base

class Expediente(Base):
    __tablename__ = "expedientes"

    id = Column(Integer, primary_key=True)

    # ============================
    # RELACIÓN CON CLIENTE TITULAR
    # ============================
    cliente_id = Column(Integer, ForeignKey("clientes.id"))

    # ============================
    # IDENTIFICACIÓN DEL EXPEDIENTE
    # ============================
    id_expediente = Column(String(100), unique=True, index=True)

    # ============================
    # ESTADOS
    # ============================
    estado_expediente = Column(String(200))
    estado_expediente_ancert = Column(String(200))

    # ============================
    # FECHAS PRINCIPALES
    # ============================
    fecha_alta = Column(Date)
    fecha_firma = Column(Date)
    fecha_inscripcion = Column(Date)
    fecha_entregado_cliente = Column(Date)
    fecha_prevista_firma = Column(Date)
    fecha_vencimiento = Column(Date)
    fecha_sol_cgn = Column(Date)
    fecha_firma_prev_val = Column(Date)
    fecha_firma_prev_cli = Column(Date)

    # ============================
    # TITULAR
    # ============================
    nombre_titular = Column(String(300))
    nif_titular = Column(String(50))

    # ============================
    # NOTARIO
    # ============================
    nombre_notario = Column(String(300))
    nif_notario = Column(String(50))
    notario = Column(String(300))

    # ============================
    # OFICINA
    # ============================
    oficina = Column(String(200))
    oficina_alta = Column(String(200))
    dan = Column(String(200))

    # ============================
    # ECONÓMICOS
    # ============================
    capital = Column(Float)
    importe = Column(Float)
    saldo_real = Column(Float)
    saldo_disponible = Column(Float)

    # ============================
    # OPERACIÓN
    # ============================
    contrato = Column(String(200))
    num_solicitud_sia = Column(String(200))
    tipo_operacion = Column(String(200))
    subtipo_operacion = Column(String(200))
    vinccanc = Column(String(200))
    protocolo = Column(String(200))

    # ============================
    # GTG / BANKIA
    # ============================
    origen_bankia = Column(String(200))
    producto_gtg = Column(String(200))
    dt = Column(String(200))

    # ============================
    # ACTIVIDAD (sin modelo todavía)
    # ============================
    actividad_actual = Column(String(200))
    estado_actividad = Column(String(200))
    fecha_inicio_actividad = Column(Date)
    fecha_fin_actividad = Column(Date)

    # ============================
    # GESTORIA
    # ============================
    gestoria = Column(String(200))   # "Gestoria" / "Oficina CaixaBank"

    # ============================
    # CGN
    # ============================
    id_expediente_cgn = Column(String(200))

    # ============================
    # OTROS
    # ============================
    lucy = Column(String(200))
    indicador_tt = Column(String(200))

    # ============================
    # OBSERVACIONES
    # ============================
    observaciones = Column(String(1000))

    # ============================
    # CAMPOS EXTRA (FACTURACIÓN / REGISTRAL)
    # ============================
    # Estos se rellenarán más adelante cuando montemos los módulos correspondientes
    facturacion_estado = Column(String(200))
    facturacion_fecha = Column(Date)
    registral_estado = Column(String(200))
    registral_fecha = Column(Date)
