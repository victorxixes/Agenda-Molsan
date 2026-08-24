from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from backend.app.database import Base


# ---------------------------------------------------------
# EMPLEADOS (empleados_v2)
# ---------------------------------------------------------

class Empleado(Base):
    __tablename__ = "empleados_v2"

    id = Column(Integer, primary_key=True, index=True)

    # -----------------------------
    # DATOS PERSONALES
    # -----------------------------
    nombre = Column(String(100), nullable=True)
    apellidos = Column(String(150), nullable=True)
    dni = Column(String(20), unique=True, nullable=True)
    telefono = Column(String(20), nullable=True)
    email_personal = Column(String(150), nullable=True)
    direccion = Column(String(255), nullable=True)
    fecha_nacimiento = Column(String(20), nullable=True)

    alergias = Column(Text, nullable=True)
    persona_contacto = Column(String(150), nullable=True)
    telefono_contacto = Column(String(20), nullable=True)
    observaciones = Column(Text, nullable=True)

    # -----------------------------
    # DATOS LABORALES
    # -----------------------------
    departamento_id = Column(Integer, ForeignKey("departamentos.id"), nullable=True)
    seccion_id = Column(Integer, ForeignKey("secciones.id"), nullable=True)
    cargo_id = Column(Integer, ForeignKey("cargos.id"), nullable=True)

    # Relaciones SIN importar modelos (evita ciclos)
    departamento = relationship("Departamento", back_populates="empleados")
    seccion = relationship("Seccion", back_populates="empleados")
    cargo = relationship("Cargo", back_populates="empleados")

    email_empresa = Column(String(150), nullable=True)
    extension = Column(String(20), nullable=True)
    fecha_alta = Column(String(20), nullable=True)
    fecha_baja = Column(String(20), nullable=True)

    activo = Column(Boolean, default=True)

    # -----------------------------
    # USUARIO INTERNO
    # -----------------------------
    usuario = Column(String(100), nullable=True)
    password = Column(String(255), nullable=True)

    # -----------------------------
    # FOTO
    # -----------------------------
    foto = Column(String(255), nullable=True)

    # -----------------------------
    # MÓDULOS Y PERMISOS
    # -----------------------------
    modulos_visibles = Column(JSONB, nullable=True, default=list)
    permisos_modulo = Column(JSONB, nullable=True, default=dict)
