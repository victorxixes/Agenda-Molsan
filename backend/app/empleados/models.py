from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
import json

from backend.app.database import Base

class Empleado(Base):
    __tablename__ = "empleados_v2"

    id = Column(Integer, primary_key=True, index=True)

    # Datos personales
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

    # Datos laborales
    departamento_id = Column(Integer, ForeignKey("departamentos.id"), nullable=True)
    seccion_id = Column(Integer, ForeignKey("secciones.id"), nullable=True)
    cargo_id = Column(Integer, ForeignKey("cargos.id"), nullable=True)

    departamento = relationship("Departamento", back_populates="empleados")
    seccion = relationship("Seccion", back_populates="empleados")
    cargo = relationship("Cargo", back_populates="empleados")

    email_empresa = Column(String(150), nullable=True)
    extension = Column(String(20), nullable=True)
    fecha_alta = Column(String(20), nullable=True)
    fecha_baja = Column(String(20), nullable=True)

    activo = Column(Boolean, default=True)

    # Usuario interno
    usuario = Column(String(100), nullable=True)
    password = Column(String(255), nullable=True)

    # Foto
    foto = Column(String(255), nullable=True)

    # 🔥 ROL DEL ERP
    rol_id = Column(Integer, ForeignKey("roles.id"), nullable=True)
    rol = relationship("Rol", back_populates="empleados")

    # Módulos y permisos (SQLite → TEXT)
    modulos_visibles = Column(Text, nullable=True, default="[]")
    permisos_modulo = Column(Text, nullable=True, default="{}")

    # -------------------------
    # Helpers JSON → Python
    # -------------------------
    @property
    def modulos_visibles_list(self):
        try:
            return json.loads(self.modulos_visibles or "[]")
        except:
            return []

    @modulos_visibles_list.setter
    def modulos_visibles_list(self, value):
        self.modulos_visibles = json.dumps(value)

    @property
    def permisos_modulo_dict(self):
        try:
            return json.loads(self.permisos_modulo or "{}")
        except:
            return {}

    @permisos_modulo_dict.setter
    def permisos_modulo_dict(self, value):
        self.permisos_modulo = json.dumps(value)
