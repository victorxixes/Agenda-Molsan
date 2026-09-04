from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from backend.app.database import Base

class Rol(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True)
    descripcion = Column(String)

    permisos_modulo_dict = Column(JSONB, default={})
    modulos_visibles_list = Column(JSONB, default=[])
