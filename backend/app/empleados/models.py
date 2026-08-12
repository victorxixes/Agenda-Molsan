from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base

class Empleado(Base):
    __tablename__ = "empleados_v2"   # 🔥 TABLA NUEVA

    id = Column(Integer, primary_key=True, index=True)

    # ---------------------------------------------------------
# TABLAS MAESTRAS
# ---------------------------------------------------------

class Departamento(Base):
    __tablename__ = "departamentos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)

    empleados = relationship("Empleado", back_populates="departamento")


class Seccion(Base):
    __tablename__ = "secciones"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)

    empleados = relationship("Empleado", back_populates="seccion")


class Cargo(Base):
    __tablename__ = "cargos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)

    empleados = relationship("Empleado", back_populates="cargo")
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
    departamento_id = Column(Integer, nullable=True)
    seccion_id = Column(Integer, nullable=True)
    cargo_id = Column(Integer, nullable=True)

    email_empresa = Column(String(150), nullable=True)
    extension = Column(String(20), nullable=True)
    fecha_alta = Column(String(20), nullable=True)
    fecha_baja = Column(String(20), nullable=True)

    # -----------------------------
    # ESTADO
    # -----------------------------
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
    modulos_visibles = Column(JSONB, nullable=True, default=[])
    permisos_modulo = Column(JSONB, nullable=True, default={})
