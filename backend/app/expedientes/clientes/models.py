from sqlalchemy import Column, Integer, String
from backend.app.database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)

    # Identificación
    nombre = Column(String(200))
    apellidos = Column(String(200))
    dni = Column(String(50), unique=True, index=True)

    # Datos de contacto
    telefono = Column(String(50))
    email = Column(String(200))

    # Dirección
    direccion = Column(String(300))
    codigo_postal = Column(String(20))
    poblacion = Column(String(200))
    provincia = Column(String(200))

    # Facturación / idioma
    idioma = Column(String(50))
