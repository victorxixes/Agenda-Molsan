from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# ---------------------------------------------------------
# FIX TABLES / BOOTSTRAP
# ---------------------------------------------------------
from backend.app.agenda.fix_table import fix_table
# ❌ NO ejecutar fix_table en producción
# fix_table()

from backend.app.database import Base, engine
Base.metadata.create_all(bind=engine)

from backend.app.agenda.bootstrap import bootstrap_agenda
# ❌ NO ejecutar bootstrap_agenda en producción
# bootstrap_agenda()


# ---------------------------------------------------------
# APP
# ---------------------------------------------------------
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
# ROUTERS NORMALES (REST)
# ---------------------------------------------------------

# Admin Noticias (PostgreSQL)
from backend.app.intranet.noticias.router_reset_pg import router as router_reset_pg
from backend.app.intranet.noticias.router_fix_pg import router as router_fix_pg
from backend.app.intranet.noticias.router_fix_schema import router as router_fix_noticias

# Seguridad / Auth
from backend.app.seguridad.router import router as seguridad_router
from backend.app.seguridad.permisos_router import router as permisos_router
from backend.app.auth.router import router as auth_router

# Empleados
from backend.app.empleados.router import router as empleados_router

# Maestros
from backend.app.maestros.router import router as maestros_router

# CTN
from backend.app.ctn.router import router as ctn_router

# Agenda
from backend.app.agenda.router import router as agenda_router
from backend.app.agenda.notarios_router import router as agenda_notarios_router

# Auditoría / Dashboard / Informes
from backend.app.auditoria.router import router as auditoria_router
from backend.app.dashboard.router import router as dashboard_router
from backend.app.informes.router import router as informes_router

# Intranet
from backend.app.intranet.noticias.router import router as noticias_router
from backend.app.intranet.documentos.router import router as documentos_router

# Logs / Mensajes / Realtime REST
from backend.app.logs.router import router as logs_router
from backend.app.mensajes.router import router as mensajes_router
from backend.app.realtime.router import router as realtime_router

# Utilidades
from backend.app.utilidades.router import router as utilidades_router
from backend.app.utilidades.router_create import router as create_router
from backend.app.utilidades.router_force import router as force_router

# ---------------------------------------------------------
# INCLUIR ROUTERS REST
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
# WEBSOCKETS
# ---------------------------------------------------------
from backend.app.websockets.chat_ws import router as chat_ws_router
from backend.app.websockets.empleados_ws import router as empleados_ws_router
from backend.app.websockets.intranet_ws import router as intranet_ws_router
from backend.app.websockets.notificaciones_ws import router as notificaciones_ws_router

app.include_router(chat_ws_router)
app.include_router(empleados_ws_router)
app.include_router(intranet_ws_router)
app.include_router(notificaciones_ws_router)


# ---------------------------------------------------------
# STATIC FILES
# ---------------------------------------------------------
FOTOS_DIR = os.path.join(os.path.dirname(__file__), "fotos")
app.mount("/fotos", StaticFiles(directory=FOTOS_DIR), name="fotos")
