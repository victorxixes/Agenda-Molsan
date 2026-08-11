from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import Base, engine

# ---------------------------------------------------------
# CREAR TABLAS
# ---------------------------------------------------------
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agenda Intranet Backend")

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
origins = [
    "https://agenda-intranet-f.onrender.com",
    "http://localhost:5173",  # para desarrollo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# IMPORTAR ROUTERS
# ---------------------------------------------------------

# Admin Noticias (PostgreSQL)
from app.intranet.noticias.router_reset_pg import router as router_reset_pg
from app.intranet.noticias.router_fix_pg import router as router_fix_pg
from app.intranet.noticias.router_fix_schema import router as router_fix_noticias

# Seguridad / Auth
from app.seguridad.router import router as seguridad_router
from app.seguridad.permisos_router import router as permisos_router
from app.auth.router import router as auth_router

# Empleados
from app.empleados.router import router as empleados_router


# Maestros
from app.maestros.router import router as maestros_router

# CTN
from app.ctn.router import router as ctn_router

# Agenda
from app.agenda.router import router as agenda_router
from app.agenda.notarios_router import router as agenda_notarios_router

# Auditoría / Dashboard / Informes
from app.auditoria.router import router as auditoria_router
from app.dashboard.router import router as dashboard_router
from app.informes.router import router as informes_router

# Intranet
from app.intranet.noticias.router import router as noticias_router
from app.intranet.documentos.router import router as documentos_router

# Logs / Mensajes / Realtime
from app.logs.router import router as logs_router
from app.mensajes.router import router as mensajes_router
from app.realtime.router import router as realtime_router

# Utilidades
from app.utilidades.router import router as utilidades_router
from app.utilidades.router_create import router as create_router
from app.utilidades.router_force import router as force_router

# ---------------------------------------------------------
# INCLUIR ROUTERS
# ---------------------------------------------------------

# Admin Noticias
app.include_router(router_reset_pg)
app.include_router(router_fix_pg)
app.include_router(router_fix_noticias)

# Seguridad / Auth
app.include_router(auth_router)
app.include_router(seguridad_router)
app.include_router(permisos_router)

# Empleados
app.include_router(empleados_router)


# Maestros
app.include_router(maestros_router)

# Intranet
app.include_router(noticias_router)
app.include_router(documentos_router)

# CTN
app.include_router(ctn_router)

# Agenda
app.include_router(agenda_router)
app.include_router(agenda_notarios_router)

# Auditoría / Dashboard / Informes
app.include_router(auditoria_router)
app.include_router(dashboard_router)
app.include_router(informes_router)

# Logs / Mensajes / Realtime
app.include_router(logs_router)
app.include_router(mensajes_router)
app.include_router(realtime_router)

# Utilidades
app.include_router(utilidades_router)
app.include_router(create_router)
app.include_router(force_router)

# ---------------------------------------------------------
# STATIC FILES
# ---------------------------------------------------------
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
