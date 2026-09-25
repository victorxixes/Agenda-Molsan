from sqlalchemy import Column, Integer, String
from backend.app.database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)

    # ============================
    # TITULAR DEL EXPEDIENTE
    # ============================
    nombre_completo = Column(String(300))
    dni = Column(String(50), unique=True, index=True)

    # Datos de contacto del titular
    telefono = Column(String(50))
    email = Column(String(200))

    # Dirección del titular
    direccion = Column(String(300))
    codigo_postal = Column(String(20))
    poblacion = Column(String(200))
    provincia = Column(String(200))

    # Idioma del titular
    idioma = Column(String(50))

    # ============================
    # DATOS DE FACTURACIÓN
    # ============================
    nombre_facturacion = Column(String(300))
    dni_facturacion = Column(String(50))

    telefono_facturacion = Column(String(50))
    email_facturacion = Column(String(200))

    direccion_facturacion = Column(String(300))
    codigo_postal_facturacion = Column(String(20))
    poblacion_facturacion = Column(String(200))
    provincia_facturacion = Column(String(200))
