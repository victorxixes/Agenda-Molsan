from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import Base, engine, get_db

# IMPORTAR MODELOS
from app.empleados.models import Empleado
from app.maestros.models import Departamento, Seccion, Cargo
from app.auditoria.models import Auditoria
from app.logs.models import Log
from app.intranet.noticias.models import Noticia
from app.intranet.documentos.models import Documento
from app.agenda.models import Cita
from app.ctn.models import Notaria

# Routers admin (PostgreSQL)
from app.intranet.noticias.router_reset_pg import router as router_reset_pg
from app.intranet.noticias.router_fix_pg import router as router_fix_pg
from app.intranet.noticias.router_fix_schema import router as router_fix_noticias

# Utilidades
from app.utilidades.router import router as utilidades_router

# CREAR TABLAS
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agenda Intranet Backend")

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agenda-intranet-f.onrender.com",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# IMPORTAR ROUTERS
# ---------------------------------------------------------
from app.seguridad.router_fix_schema import fix_empleados_schema
fix_empleados_schema()

from app.seguridad.router import router as seguridad_router
from app.seguridad.permisos_router import router as permisos_router
from app.auth.router import router as auth_router
from app.empleados.router import router as empleados_router
from app.maestros.router import router as maestros_router

from app.ctn.router import router as ctn_router
from app.agenda.router import router as agenda_router
from app.agenda.notarios_router import router as agenda_notarios_router

from app.auditoria.router import router as auditoria_router
from app.dashboard.router import router as dashboard_router
from app.informes.router import router as informes_router
from app.intranet.noticias.router import router as noticias_router
from app.intranet.documentos.router import router as documentos_router
from app.logs.router import router as logs_router
from app.mensajes.router import router as mensajes_router
from app.realtime.router import router as realtime_router

# ---------------------------------------------------------
# INCLUIR ROUTERS (ORDEN CORRECTO)
# ---------------------------------------------------------

# Admin
app.include_router(router_reset_pg)
app.include_router(router_fix_pg)
app.include_router(router_fix_noticias)

# Autenticación y seguridad
app.include_router(auth_router)
app.include_router(seguridad_router)
app.include_router(permisos_router)

# Empleados y maestros
app.include_router(empleados_router)
app.include_router(maestros_router)

# Noticias y documentos
app.include_router(noticias_router)
app.include_router(documentos_router)

# CTN antes que Agenda
app.include_router(ctn_router)

# Agenda
app.include_router(agenda_router)
app.include_router(agenda_notarios_router)

# Auditoría, informes, dashboard
app.include_router(auditoria_router)
app.include_router(dashboard_router)
app.include_router(informes_router)

# Logs, mensajes, realtime
app.include_router(logs_router)
app.include_router(mensajes_router)
app.include_router(realtime_router)

# Utilidades al final
app.include_router(utilidades_router)

# ---------------------------------------------------------
# STATIC FILES
# ---------------------------------------------------------
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
