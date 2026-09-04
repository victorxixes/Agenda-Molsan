from sqlalchemy import Column, Integer, String
from backend.app.database import Base

class Permiso(Base):
    __tablename__ = "permisos"

    id = Column(Integer, primary_key=True, index=True)
    modulo = Column(String)
    permiso = Column(String)
