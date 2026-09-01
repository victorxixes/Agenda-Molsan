from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base


class Notaria(Base):
    __tablename__ = "ctn_notarios"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    # Datos básicos
    codigo = Column(String(50), nullable=True)
    nombre = Column(String(150), nullable=True)
    apellidos = Column(String(150), nullable=True)
    nif = Column(String(50), nullable=True)
    telefono = Column(String(50), nullable=True)

    # Departamentos internos
    departamento_cancelaciones = Column(String(150), nullable=True)
    departamento_copias = Column(String(150), nullable=True)
    otros_departamentos = Column(String(255), nullable=True)

    # Dirección
    cp = Column(String(10), nullable=True)
    provincia = Column(String(100), nullable=True)
    municipio = Column(String(100), nullable=True)

    # VC (valor catastral o código interno)
    vc = Column(String(50), nullable=True)

    # Apoderados
    apoderado = Column(String(150), nullable=True)
    apoderado_s = Column(String(150), nullable=True)

    # Observaciones
    observacion = Column(Text, nullable=True)

    # Relación opcional con apoderados (si existe tabla)
    apoderado_id = Column(Integer, nullable=True)

    # Relación con citas
    citas = relationship("Cita", back_populates="notario")
