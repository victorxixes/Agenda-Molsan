from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import sqlalchemy

# ---------------------------------------------------------
# DATABASE
# ---------------------------------------------------------
from backend.app.database import SessionLocal, Base, engine
from backend.app.mensajes.models import UsuarioEstado

# ---------------------------------------------------------
# IMPORTAR MODELOS (ANTES DE CREAR TABLAS)
# ---------------------------------------------------------
from backend.app.seguridad.models import Rol, EventoSeguridad, Auditoria
from backend.app.empleados.models import Empleado
from backend.app.maestros.models import Departamento, Seccion, Cargo
from backend.app.ctn.models import Notaria
from backend.app.agenda.models import Cita
from backend.app.intranet.noticias.models import Noticia
from backend.app.intranet.documentos.models import Documento
from backend.app.logs.models import Log
from backend.app.mensajes.models import Mensaje

# ---------------------------------------------------------
# CREAR TABLAS
# ---------------------------------------------------------
sqlalchemy.orm.configure_mappers()
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------
# APP
# ---------------------------------------------------------
app = FastAPI(title="Agenda Intranet Backend")

# ---------------------------------------------------------
# LIMPIAR ESTADOS EN STARTUP
# ---------------------------------------------------------
@app.on_event("startup")
def limpiar_estados():
    db = SessionLocal()
    db.query(UsuarioEstado).update({UsuarioEstado.conectado: False})
    db.commit()
    db.close()

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
origins = [
    "https://agenda-intranet-f.onrender.com",
    "https://agenda-intranet-frontend.onrender.com",
    "https://agenda-intranet-b.onrender.com",
    "https://agenda-intranet.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# STATIC FILES (CORREGIDO)
# ---------------------------------------------------------
FOTOS_DIR = os.path.join(os.path.dirname(__file__), "fotos")
app.mount("/api/fotos", StaticFiles(directory=FOTOS_DIR), name="fotos")

# ---------------------------------------------------------
# IMPORTAR ROUTERS (REST)
# ---------------------------------------------------------

# Seguridad
from backend.app.seguridad.router_roles import router as seguridad_roles_router
from backend.app.seguridad.permisos_router import router as permisos_router
from backend.app.seguridad.router_eventos import router as seguridad_eventos_router
from backend.app.seguridad.router_auditoria import router as seguridad_auditoria_router
from backend.app.seguridad.repair_router import router as repair_router
from backend.app.seguridad.repair_full import router as repair_full_router
from backend.app.seguridad.inspect_roles import router as inspect_roles_router
from backend.app.seguridad.repair_create_roles import router as repair_create_roles_router
from backend.app.seguridad.repair_create_roles_raw import router as repair_create_roles_raw_router

# Auth
from backend.app.auth.router import router as auth_router

# Empleados / Maestros
from backend.app.empleados.router import router as empleados_router
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

app.include_router(auth_router, prefix="/api")

# Seguridad
app.include_router(seguridad_roles_router, prefix="/api")
app.include_router(permisos_router, prefix="/api")
app.include_router(seguridad_eventos_router, prefix="/api")
app.include_router(seguridad_auditoria_router, prefix="/api")
app.include_router(repair_router, prefix="/api")
app.include_router(repair_full_router, prefix="/api")
app.include_router(inspect_roles_router, prefix="/api")
app.include_router(repair_create_roles_router, prefix="/api")
app.include_router(repair_create_roles_raw_router, prefix="/api")

# Empleados / Maestros
app.include_router(empleados_router, prefix="/api")
app.include_router(maestros_router, prefix="/api")
app.include_router(repair_router, prefix="/api")

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

# Logs / Mensajes / Realtime REST
app.include_router(logs_router, prefix="/api")
app.include_router(mensajes_router, prefix="/api")
app.include_router(realtime_router, prefix="/api")

# Utilidades
app.include_router(utilidades_router, prefix="/api")
app.include_router(create_router, prefix="/api")
app.include_router(force_router, prefix="/api")

# ---------------------------------------------------------
# IMPORTAR WEBSOCKETS (AL FINAL)
# ---------------------------------------------------------

from backend.app.websockets.chat_ws import router as chat_ws_router
from backend.app.websockets.empleados_ws import router as empleados_ws_router
from backend.app.websockets.intranet_ws import router as intranet_ws_router
from backend.app.websockets.notificaciones_ws import router as notificaciones_ws_router
from backend.app.websockets.seguridad_ws import router as seguridad_ws_router

# ---------------------------------------------------------
# INCLUIR WEBSOCKETS (SIN SCHEMA)
# ---------------------------------------------------------

app.include_router(chat_ws_router, include_in_schema=False)
app.include_router(empleados_ws_router, include_in_schema=False)
app.include_router(intranet_ws_router, include_in_schema=False)
app.include_router(notificaciones_ws_router, include_in_schema=False)
app.include_router(seguridad_ws_router, include_in_schema=False)
