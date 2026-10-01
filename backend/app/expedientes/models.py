from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey

from backend.app.database import Base


class Expediente(Base):
    __tablename__ = "expedientes"

    # ============================================================
    # ID INTERNO
    # ============================================================

    id = Column(
        Integer,
        primary_key=True
    )

    # ============================================================
    # RELACIÓN CON CLIENTE
    # ============================================================

    cliente_id = Column(
        Integer,
        ForeignKey("clientes.id"),
        nullable=True,
        index=True
    )

    # ============================================================
    # IDENTIFICACIÓN
    # ============================================================

    # IDEXPEDIENTE
    id_expediente = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False
    )

    # ============================================================
    # ESTADOS
    # ============================================================

    # ESTADOEXPEDIENTE
    estado_expediente = Column(
        String(200)
    )

    # ESTADOEXPEDIENTEANCERT
    estado_expediente_ancert = Column(
        String(200)
    )

    # ESTADOACTIVIDAD
    estado_actividad = Column(
        String(200)
    )

    # ============================================================
    # FECHAS
    # ============================================================

    # FECHAALTA
    fecha_alta = Column(
        Date,
        index=True
    )

    # FECHAFIRMA
    fecha_firma = Column(
        Date
    )

    # FECHAINSCRIPCION
    fecha_inscripcion = Column(
        Date
    )

    # FECHAENTREGADOCLIENTE
    fecha_entregado_cliente = Column(
        Date
    )

    # FECHAPREVISTAFIRMA
    fecha_prevista_firma = Column(
        Date
    )

    # FECHAVENCIMIENTO
    fecha_vencimiento = Column(
        Date
    )

    # FECHASOLCGN
    fecha_sol_cgn = Column(
        Date
    )

    # FECHAFIRMAPREVVAL
    fecha_firma_prev_val = Column(
        Date
    )

    # FECHAFIRMAPREVCLI
    fecha_firma_prev_cli = Column(
        Date
    )

    # FECHAINICIOACTIVIDAD
    fecha_inicio_actividad = Column(
        Date
    )

    # FECHAFINACTIVIDAD
    fecha_fin_actividad = Column(
        Date
    )

    # ============================================================
    # ORIGEN / BANCO
    # ============================================================

    # ORIGENBANKIA
    origen_bankia = Column(
        String(200)
    )

    # DT
    dt = Column(
        String(200)
    )

    # PRODUCTOGTG
    producto_gtg = Column(
        String(200)
    )

    # ============================================================
    # ACTIVIDAD
    # ============================================================

    # ACTIVIDADACTUAL
    actividad_actual = Column(
        String(300)
    )

    # ============================================================
    # DATOS DE PROVISIÓN
    # ============================================================

    # IDPROVISION
    id_provision = Column(
        String(100)
    )

    # TIPOPROVISION
    tipo_provision = Column(
        String(100)
    )

    # ============================================================
    # OPERACIÓN
    # ============================================================

    # CONTRATO
    contrato = Column(
        String(200)
    )

    # NUMSOLICITUDSIA
    num_solicitud_sia = Column(
        String(200)
    )

    # TIPOOPERACION
    tipo_operacion = Column(
        String(300)
    )

    # SUBTIPOOPERACION
    subtipo_operacion = Column(
        String(300)
    )

    # VINCCANC
    vinccanc = Column(
        String(200)
    )

    # PROTOCOLO
    protocolo = Column(
        String(200)
    )

    # ============================================================
    # GESTORÍA
    # ============================================================

    # IDGESTORIATRAMITE
    id_gestoria_tramite = Column(
        String(100)
    )

    # NOMBREGESTORIA
    nombre_gestoria = Column(
        String(300)
    )

    # Campo compatible con la estructura anterior.
    # Puede utilizarse para mostrar la gestoría principal.
    gestoria = Column(
        String(300)
    )

    # ============================================================
    # OFICINA
    # ============================================================

    # OFICINA
    oficina = Column(
        String(200)
    )

    # DAN
    dan = Column(
        String(200)
    )

    # OFICINAALTA
    oficina_alta = Column(
        String(200)
    )

    # ============================================================
    # ECONÓMICOS
    # ============================================================

    # CAPITAL
    capital = Column(
        Float
    )

    # IMPORTE
    importe = Column(
        Float
    )

    # SALDOREAL
    saldo_real = Column(
        Float
    )

    # SALDODISPONIBLE
    saldo_disponible = Column(
        Float
    )

    # ============================================================
    # FINCA
    # ============================================================

    # FINCA
    finca = Column(
        String(200)
    )

    # ============================================================
    # SOLICITANTE
    # ============================================================

    # NOMBRESOLICITANTE
    nombre_solicitante = Column(
        String(300)
    )

    # NIFSOLICITANTE
    nif_solicitante = Column(
        String(50)
    )

    # ============================================================
    # TITULAR
    # ============================================================

    # NOMBRETITULAR
    nombre_titular = Column(
        String(300)
    )

    # NIFTITULAR
    nif_titular = Column(
        String(50)
    )

    # ============================================================
    # NOTARIO
    # ============================================================

    # NOMBRENOTARIO
    nombre_notario = Column(
        String(300)
    )

    # NIFNOTARIO
    nif_notario = Column(
        String(50)
    )

    # NOTARIO
    notario = Column(
        String(300)
    )

    # TIPOACTA
    tipo_acta = Column(
        String(200)
    )

    # ============================================================
    # APODERADO
    # ============================================================

    # APODERADO
    apoderado = Column(
        String(300)
    )

    # ============================================================
    # DEFECTOS
    # ============================================================

    # TIENEDEFECTOSABIERTOS
    tiene_defectos_abiertos = Column(
        String(50)
    )

    # TIPOERROR
    tipo_error = Column(
        String(200)
    )

    # DESCRIPCIONERROR
    descripcion_error = Column(
        String(1000)
    )

    # FALTADEFECTO
    falta_defecto = Column(
        String(1000)
    )

    # FCIERREDEFECTO
    fcierre_defecto = Column(
        Date
    )

    # ============================================================
    # CGN
    # ============================================================

    # IDEXPEDIENTECGN
    id_expediente_cgn = Column(
        String(200)
    )

    # ============================================================
    # OTROS
    # ============================================================

    # LUCY
    lucy = Column(
        String(200)
    )

    # INDICADORTT
    indicador_tt = Column(
        String(200)
    )

    # ============================================================
    # OBSERVACIONES
    # ============================================================

    # OBSERVACIONES
    observaciones = Column(
        String(2000)
    )

    # ============================================================
    # FACTURACIÓN
    # ============================================================
    #
    # Estos campos NO proceden del Excel ABSIS actual.
    # Se mantienen preparados para el módulo de facturación.
    #

    facturacion_estado = Column(
        String(200)
    )

    facturacion_fecha = Column(
        Date
    )

    # ============================================================
    # REGISTRAL
    # ============================================================
    #
    # Estos campos NO proceden del Excel ABSIS actual.
    # Se mantienen preparados para el módulo registral.
    #

    registral_estado = Column(
        String(200)
    )

    registral_fecha = Column(
        Date
    )
