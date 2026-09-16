from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# ============================================================
# BASE DE DATOS
# ============================================================
from backend.app.database import Base, engine

# ============================================================
# IMPORTAR MODELOS (REGISTRA TABLAS)
# ============================================================
from backend.app.empleados.models import Empleado
from backend.app.mensajes.models import Mensaje
from backend.app.intranet.models import IntranetDocumento, IntranetNoticia
from backend.app.seguridad.models import (
    SeguridadAuditoria,
    SeguridadLog,
    Rol,
    Permiso
)
from backend.app.ctn.models import CtnNotario
from backend.app.agenda.models import AgendaCita
from backend.app.maestros.models import Maestro

# ============================================================
# IMPORTAR ROUTERS (SEGÚN SWAGGER REAL)
# ============================================================

# Auth
from backend.app.auth.router import router as auth_router

# Seguridad
from backend.app.seguridad.router_roles import router as seguridad_roles_router
from backend.app.seguridad.router_asignacion import router as seguridad_asignacion_router
from backend.app.seguridad.router_permisos import router as seguridad_permisos_router
from backend.app.seguridad.router_ficha import router as seguridad_ficha_router
from backend.app.seguridad.router_auditoria import router as seguridad_auditoria_router
from backend.app.seguridad.router_logs import router as seguridad_logs_router

# Admin
from backend.app.admin.router import router as admin_router

# Agenda
from backend.app.agenda.router import router as agenda_router
from backend.app.agenda.router_notarios import router as agenda_notarios_router

# Empleados
from backend.app.empleados.router import router as empleados_router

# Maestros
from backend.app.maestros.router import router as maestros_router

# Intranet
from backend.app.intranet.router_documentos import router as intranet_documentos_router
from backend.app.intranet.router_noticias import router as intranet_noticias_router

# Utilidades
from backend.app.utilidades.router import router as utilidades_router

# CTN
from backend.app.ctn.router import router as ctn_router

# Dashboard
from backend.app.dashboard.router import router as dashboard_router

# Mensajes
from backend.app.mensajes.router import router as mensajes_router
from backend.app.mensajes.router_ws import router as mensajes_ws_router
from backend.app.WebSockets.docs import router_ws_docs

# Debug
from backend.app.debug.router import router as debug_router

# ============================================================
# CREAR TABLAS AUTOMÁTICAMENTE
# ============================================================
Base.metadata.create_all(bind=engine)

# ============================================================
# APP FASTAPI
# ============================================================
app = FastAPI(
    title="Agenda Intranet",
    version="0.1.0"
)

# ============================================================
# CORS PARA RENDER
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agenda-intranet-f.onrender.com",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# STATIC FILES
# ============================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

STATIC_DIR = os.path.join(BASE_DIR, "static")
FOTOS_DIR = os.path.join(BASE_DIR, "fotos")

os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(FOTOS_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/fotos", StaticFiles(directory=FOTOS_DIR), name="fotos")

# ============================================================
# ROUTERS HTTP (REST)
# ============================================================

# Auth
app.include_router(auth_router, prefix="/api")

# Seguridad
app.include_router(seguridad_roles_router, prefix="/api")
app.include_router(seguridad_asignacion_router, prefix="/api")
app.include_router(seguridad_permisos_router, prefix="/api")
app.include_router(seguridad_ficha_router, prefix="/api")
app.include_router(seguridad_auditoria_router, prefix="/api")
app.include_router(seguridad_logs_router, prefix="/api")

# Admin
app.include_router(admin_router, prefix="/api")

# Agenda
app.include_router(agenda_router, prefix="/api")
app.include_router(agenda_notarios_router, prefix="/api")

# Empleados
app.include_router(empleados_router, prefix="/api")

# Maestros
app.include_router(maestros_router, prefix="/api")

# Intranet
app.include_router(intranet_documentos_router, prefix="/api")
app.include_router(intranet_noticias_router, prefix="/api")

# Utilidades
app.include_router(utilidades_router, prefix="/api")

# CTN
app.include_router(ctn_router, prefix="/api")

# Dashboard
app.include_router(dashboard_router, prefix="/api")

# Mensajes
app.include_router(mensajes_router, prefix="/api")

# Debug
app.include_router(debug_router)

# ============================================================
# ROUTERS WEBSOCKET
# ============================================================
app.include_router(mensajes_ws_router)
app.include_router(router_ws_docs)
