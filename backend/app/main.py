from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
 
# ---------------------------------------------------------
# APP
# ---------------------------------------------------------
app = FastAPI(title="Agenda Intranet Backend")

@app.get("/")
def root():
    return {"status": "ERP Molsan 2026 funcionando correctamente"}

# ---------------------------------------------------------
# CORS — CONFIGURACIÓN FINAL PARA RENDER
# ---------------------------------------------------------
FRONTEND = "https://agenda-intranet-f.onrender.com"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND],      # SOLO el front, nunca "*"
    allow_credentials=True,        # axios.withCredentials = true
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# STATIC FILES
# ---------------------------------------------------------
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

TMP_MENSAJES = "/tmp/mensajes"
os.makedirs(TMP_MENSAJES, exist_ok=True)
app.mount("/static/mensajes", StaticFiles(directory=TMP_MENSAJES), name="mensajes")

# ---------------------------------------------------------
# IMPORTAR ROUTERS
# ---------------------------------------------------------
from backend.app.auth.router import router as auth_router
from backend.app.seguridad.roles.roles_router import router as roles_router
from backend.app.seguridad.roles.asignar_rol_router import router as asignar_rol_router
from backend.app.seguridad.asignar_password_router import router as asignar_password_router
from backend.app.seguridad.permisos.permisos_router import router as permisos_router
from backend.app.seguridad.permisos.asignar_router import router as asignar_router
from backend.app.seguridad.permisos.repair_create_permisos_raw import router as permisos_repair_router
from backend.app.seguridad.obtener_ficha_empleado import router as ficha_empleado_router
from backend.app.seguridad.auditoria.router import router as seguridad_auditoria_router
from backend.app.seguridad.logs.router import router as seguridad_logs_router
from backend.app.seguridad.admin_router import router as admin_router

from backend.app.empleados.router import router as empleados_router
from backend.app.maestros.router import router as maestros_router

from backend.app.intranet.documentos.router import router as documentos_router
from backend.app.intranet.noticias.router import router as noticias_router
from backend.app.websockets.intranet_ws import router as intranet_ws_router

from backend.app.agenda.router import router as agenda_router

from backend.app.websockets.empleados_ws import router as empleados_ws_router
from backend.app.websockets.agenda_ws import router as agenda_ws_router
from backend.app.mensajes.router_ws import router as mensajes_ws_router
from backend.app.realtime.router import router as realtime_router

from backend.app.herramientasswager.crear_tablas import router as herramientas_router
from backend.app.herramientasswager.reset_intranet import router as reset_intranet_router
from backend.app.herramientasswager.debug_router import router as debug_router
from backend.app.herramientasswager.borrar_roles import router as borrar_roles_router
from backend.app.herramientasswager.borrar_tablas import router as borrar_tablas_router
from backend.app.herramientasswager.asignar_bloqueo_router import router as asignar_bloqueo_router

from backend.app.ctn.router import router as ctn_router
from backend.app.dashboard.router import router as dashboard_router
from backend.app.mensajes.router import router as mensajes_router
from backend.app.Utilidades.router import router as utilidades_router

# ---------------------------------------------------------
# INCLUIR ROUTERS
# ---------------------------------------------------------
app.include_router(auth_router, prefix="/api")
app.include_router(roles_router, prefix="/api")
app.include_router(asignar_rol_router, prefix="/api")
app.include_router(asignar_password_router, prefix="/api")
app.include_router(permisos_router, prefix="/api")
app.include_router(asignar_router, prefix="/api")
app.include_router(permisos_repair_router, prefix="/api")
app.include_router(ficha_empleado_router, prefix="/api")
app.include_router(seguridad_auditoria_router, prefix="/api")
app.include_router(seguridad_logs_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

app.include_router(empleados_router, prefix="/api")
app.include_router(maestros_router, prefix="/api")

app.include_router(intranet_ws_router)
app.include_router(documentos_router, prefix="/api")
app.include_router(noticias_router, prefix="/api")

app.include_router(agenda_router, prefix="/api")

app.include_router(empleados_ws_router)
app.include_router(agenda_ws_router)
app.include_router(mensajes_ws_router)
app.include_router(realtime_router)

app.include_router(herramientas_router, prefix="/api")
app.include_router(reset_intranet_router, prefix="/api")
app.include_router(debug_router)
app.include_router(borrar_roles_router)
app.include_router(borrar_tablas_router)
app.include_router(asignar_bloqueo_router, prefix="/api")

app.include_router(ctn_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(mensajes_router, prefix="/api")
app.include_router(utilidades_router, prefix="/api")
