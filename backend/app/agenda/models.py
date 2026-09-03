from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base


# ---------------------------------------------------------
# NOTARIA (ctn_notarios)
# ---------------------------------------------------------
class Notaria(Base):
    __tablename__ = "ctn_notarios"

    id = Column(Integer, primary_key=True, index=True)

    # Ajusta estos campos a tu modelo real
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
    apoderado_id = Column(Integer, ForeignKey("empleados_v2.id"), nullable=True)
    apoderado_s = Column(String, nullable=True)
    observacion = Column(String, nullable=True)

    # Relación inversa con Cita
    citas = relationship(
        "Cita",
        back_populates="notario",
        lazy="selectin"
    )


# ---------------------------------------------------------
# EMPLEADO (empleados_v2)
# ---------------------------------------------------------
class Empleado(Base):
    __tablename__ = "empleados_v2"

    id = Column(Integer, primary_key=True, index=True)

    # Ajusta estos campos a tu modelo real
    nombre = Column(String, nullable=True)
    apellidos = Column(String, nullable=True)
    nif = Column(String, nullable=True)
    telefono = Column(String, nullable=True)
    departamento = Column(String, nullable=True)

    # Relación inversa con Cita (apoderado)
    citas = relationship(
        "Cita",
        back_populates="apoderado",
        lazy="selectin"
    )


# ---------------------------------------------------------
# CITA (agenda_citas)
# ---------------------------------------------------------
class Cita(Base):
    __tablename__ = "agenda_citas"

    id = Column(Integer, primary_key=True, index=True)

    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    tipo_cita = Column(String, nullable=False)

    vc = Column(String, nullable=True)
    observacion = Column(String, nullable=True)
    apoderado_s = Column(String, nullable=True)

    notario_id = Column(Integer, ForeignKey("ctn_notarios.id"), nullable=True)
    apoderado_id = Column(Integer, ForeignKey("empleados_v2.id"), nullable=True)

    # Relaciones ORM explícitas
    notario = relationship(
        "Notaria",
        back_populates="citas",
        lazy="joined"
    )

    apoderado = relationship(
        "Empleado",
        back_populates="citas",
        lazy="joined"
    )
