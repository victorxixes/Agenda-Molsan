from sqlalchemy import Column, Integer, String
from backend.app.database import Base

class Notaria(Base):
    __tablename__ = "ctn_notarios"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True, index=True)

    codigo = Column(String, nullable=True)
    nombre = Column(String, nullable=True)
    apellidos = Column(String, nullable=True)
    nif = Column(String, nullable=True)
    telefono = Column(String, nullable=True)

    departamento_cancelaciones = Column(String, nullable=True)
    departamento_copias = Column(String, nullable=True)
    otros_departamentos = Column(String, nullable=True)

    cp = Column(String, nullable=True)
    provincia = Column(String, nullable=True)
    municipio = Column(String, nullable=True)

    vc = Column(String, nullable=True)

    apoderado = Column(String, nullable=True)
    apoderado_s = Column(String, nullable=True)

    observacion = Column(String, nullable=True)

# Alias para compatibilidad con informes
Notario = Notaria
