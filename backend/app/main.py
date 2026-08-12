from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.database import Base, engine

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
    "https://agenda-intranet-front.onrender.com",
    "http://localhost:5173",
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
from backend.intranet.noticias.router_reset_pg import router as router_reset_pg
from backend.intranet.noticias.router_fix_pg import router as router_fix_pg
from backend.intranet.noticias.router_fix_schema import router as router_fix_noticias

# Seguridad / Auth
from backend.seguridad.router import router as seguridad_router
from backend.seguridad.permisos_router import router as permisos_router
from backend.auth.router import router as auth_router

# Empleados
from backend.empleados.router import router as empleados_router

# Maestros
from backend.maestros.router import router as maestros_router

# CTN
from backend.ctn.router import router as ctn_router

# Agenda
from backend.agenda.router import router as agenda_router
from backend.agenda.notarios_router import router as agenda_notarios_router

# Auditoría / Dashboard / Informes
from backend.auditoria.router import router as auditoria_router
from backend.dashboard.router import router as dashboard_router
from backend.informes.router import router as informes_router

# Intranet
from backend.intranet.noticias.router import router as noticias_router
from backend.intranet.documentos.router import router as documentos_router

# Logs / Mensajes / Realtime
from backend.logs.router import router as logs_router
from backend.mensajes.router import router as mensajes_router
from backend.realtime.router import router as realtime_router

# Utilidades
from backend.utilidades.router import router as utilidades_router
from backend.utilidades.router_create import router as create_router
from backend.utilidades.router_force import router as force_router

# ---------------------------------------------------------
# INCLUIR ROUTERS
# ---------------------------------------------------------
app.include_router(router_reset_pg)
app.include_router(router_fix_pg)
app.include_router(router_fix_noticias)

app.include_router(auth_router)
app.include_router(seguridad_router)
app.include_router(permisos_router)

app.include_router(empleados_router)
app.include_router(maestros_router)

app.include_router(noticias_router)
app.include_router(documentos_router)

app.include_router(ctn_router)

app.include_router(agenda_router)
app.include_router(agenda_notarios_router)

app.include_router(auditoria_router)
app.include_router(dashboard_router)
app.include_router(informes_router)

app.include_router(logs_router)
app.include_router(mensajes_router)
app.include_router(realtime_router)

app.include_router(utilidades_router)
app.include_router(create_router)
app.include_router(force_router)

# ---------------------------------------------------------
# STATIC FILES
# ---------------------------------------------------------
FOTOS_DIR = os.path.join(os.path.dirname(__file__), "fotos")
app.mount("/fotos", StaticFiles(directory=FOTOS_DIR), name="fotos")
