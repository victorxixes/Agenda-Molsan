from sqlalchemy import Column, Integer, String, Date, ForeignKey
from backend.app.database import Base

class ExpedienteFinca(Base):
    __tablename__ = "expediente_fincas"

    id = Column(Integer, primary_key=True)

    # Relación con expediente
    expediente_id = Column(Integer, ForeignKey("expedientes.id"))

    # ============================
    # DATOS REGISTRALES
    # ============================

    # Número de finca
    finca = Column(String(200))

    # CRU / IDUFIR
    cru_idufir = Column(String(200))

    # Provincia registral
    provincia = Column(String(200))

    # Población registral
    poblacion = Column(String(200))

    # Registro (número + nombre)
    registro = Column(String(300))

    # Sección
    seccion = Column(String(100))

    # Cuantía
    cuantia = Column(String(200))

    # Inscripción
    inscripcion = Column(String(200))

    # Contrato
    contrato = Column(String(200))

    # Fecha constitución
    fecha_constitucion = Column(Date)

    # Subrogado (SI / NO)
    subrogado = Column(String(20))

    # Entidad original
    entidad_original = Column(String(300))
