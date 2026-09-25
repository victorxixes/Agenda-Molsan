from sqlalchemy import Column, Integer, String
from backend.app.database import Base

class ClienteFacturacion(Base):
    __tablename__ = "clientes_facturacion"

    id = Column(Integer, primary_key=True, index=True)

    # Datos de facturación
    nombre_completo = Column(String(300))
    dni = Column(String(50), index=True)

    telefono = Column(String(50))
    email = Column(String(200))

    direccion = Column(String(300))
    codigo_postal = Column(String(20))
    poblacion = Column(String(200))
    provincia = Column(String(200))

    idioma = Column(String(50))
