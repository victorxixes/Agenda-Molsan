from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# ---------------------------------------------------------
# IMPORTAR TODOS LOS MODELOS DEL ERP
# ---------------------------------------------------------
# Seguridad
from backend.app.seguridad.auditoria.models import Auditoria
from backend.app.seguridad.logs.models import Log

# CTN
from backend.app.ctn.models import Notaria

# Empleados
from backend.app.empleados.models import Empleado

# Intranet
from backend.app.intranet.noticias.models import Noticia
from backend.app.intranet.documentos.models import Documento

# Mensajes
from backend.app.mensajes.models import Mensaje

# Agenda
from backend.app.agenda.models import Cita

# ---------------------------------------------------------
# CONFIGURACIÓN DB
# ---------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# ---------------------------------------------------------
# DEPENDENCIA get_db
# ---------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
