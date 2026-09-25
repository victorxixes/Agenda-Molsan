class Expediente(Base):
    __tablename__ = "expedientes"

    id = Column(Integer, primary_key=True)

    # Relación titular
    cliente_id = Column(Integer, ForeignKey("clientes.id"))

    # Relación facturación
    cliente_facturacion_id = Column(Integer, ForeignKey("clientes_facturacion.id"))
