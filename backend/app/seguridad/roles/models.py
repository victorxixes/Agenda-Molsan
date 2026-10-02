from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from backend.app.database import Base


class Rol(Base):
    __tablename__ = "roles"

    # =========================================================
    # IDENTIFICACIÓN
    # =========================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =========================================================
    # DATOS DEL ROL
    # =========================================================

    nombre = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    descripcion = Column(
        String,
        nullable=True
    )

    # =========================================================
    # RELACIÓN CON EMPLEADOS
    # =========================================================

    empleados = relationship(
        "Empleado",
        back_populates="rol"
    )
