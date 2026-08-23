
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.app.database import Base, engine
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agenda Intranet Backend")

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
origins = [
    "https://agenda-intranet-f.onrender.com",
    "https://agenda-intranet-b.onrender.com",
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
# ROUTERS (REST)
# ---------------------------------------------------------

# SEGURIDAD (versión estable)
from backend.app.seguridad.router_roles import router as seguridad_roles_router
from backend.app.seguridad.router_api import router as seguridad_api_router
from backend.app.seguridad.permisos_router import router as permisos_router

# AUTH
from backend.app.auth.router import router as auth_router

# EMPLEADOS / MAESTROS
from backend.app.empleados.router import router as empleados_router
from backend.app.maestros.router import router as maestros_router

# CTN
from backend.app.ctn.router import router as ctn_router

# AGENDA
from backend.app.agenda.router import router as agenda_router
from backend.app.agenda.notarios_router import router as agenda_notarios_router

# AUDITORÍA / DASHBOARD / INFORMES
from backend.app.auditoria.router import router as auditoria_router
from backend.app.dashboard.router import router as dashboard_router
from backend.app.informes.router import router as informes_router

# INTRANET
from backend.app.intranet.noticias.router import router as noticias_router
from backend.app.intranet.documentos.router import router as documentos_router

# LOGS / MENSAJES / REALTIME
from backend.app.logs.router import router as logs_router
from backend.app.mensajes.router import router as mensajes_router
from backend.app.realtime.router import router as realtime_router

# UTILIDADES
from backend.app.utilidades.router import router as utilidades_router
from backend.app.utilidades.router_create import router as create_router
from backend.app.utilidades.router_force import router as force_router

# ---------------------------------------------------------
# INCLUIR ROUTERS CON PREFIX /api
# ---------------------------------------------------------

# Auth
app.include_router(auth_router, prefix="/api")

# Seguridad
app.include_router(seguridad_roles_router, prefix="/api")
app.include_router(seguridad_api_router, prefix="/api")
app.include_router(permisos_router, prefix="/api")

# Empleados / Maestros
app.include_router(empleados_router, prefix="/api")
app.include_router(maestros_router, prefix="/api")

# Intranet
app.include_router(noticias_router, prefix="/api")
app.include_router(documentos_router, prefix="/api")

# CTN
app.include_router(ctn_router, prefix="/api")

# Agenda
app.include_router(agenda_router, prefix="/api")
app.include_router(agenda_notarios_router, prefix="/api")

# Auditoría / Dashboard / Informes
app.include_router(auditoria_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(informes_router, prefix="/api")

# Logs / Mensajes / Realtime
app.include_router(logs_router, prefix="/api")
app.include_router(mensajes_router, prefix="/api")
app.include_router(realtime_router, prefix="/api")

# Utilidades
app.include_router(utilidades_router, prefix="/api")
app.include_router(create_router, prefix="/api")
app.include_router(force_router, prefix="/api")

# ---------------------------------------------------------
# WEBSOCKETS (SIN PREFIX)
# ---------------------------------------------------------
from backend.app.websockets.chat_ws import router as chat_ws_router
from backend.app.websockets.empleados_ws import router as empleados_ws_router
from backend.app.websockets.intranet_ws import router as intranet_ws_router
from backend.app.websockets.notificaciones_ws import router as notificaciones_ws_router
from backend.app.websockets.seguridad_ws import router as seguridad_ws_router

app.include_router(chat_ws_router)
app.include_router(empleados_ws_router)
app.include_router(intranet_ws_router)
app.include_router(notificaciones_ws_router)
app.include_router(seguridad_ws_router)

# ---------------------------------------------------------
# STATIC FILES
# ---------------------------------------------------------
FOTOS_DIR = os.path.join(os.path.dirname(__file__), "fotos")
app.mount("/fotos", StaticFiles(directory=FOTOS_DIR), name="fotos")
