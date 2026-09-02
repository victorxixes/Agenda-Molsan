from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# ---------------------------------------------------------
# DATABASE
# ---------------------------------------------------------
from backend.app.database import Base, engine

# ---------------------------------------------------------
# IMPORTAR MODELOS ANTES DE CREATE_ALL
# ---------------------------------------------------------
from backend.app.empleados.models import Empleado
from backend.app.seguridad.auditoria.models import Auditoria
from backend.app.seguridad.logs.models import Log
from backend.app.intranet.documentos.models import Documento
from backend.app.intranet.noticias.models import Noticia

# Crear tablas
Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------
# APP
# ---------------------------------------------------------
app = FastAPI(title="Agenda Intranet Backend")

@app.get("/")
def root():
    return {"status": "ok"}

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
# STATIC FILES (FOTOS)
# ---------------------------------------------------------
FOTOS_DIR = os.path.join(os.path.dirname(__file__), "fotos")
app.mount("/api/fotos", StaticFiles(directory=FOTOS_DIR), name="fotos")

# ---------------------------------------------------------
# IMPORTAR ROUTERS (REST)
# ---------------------------------------------------------

# Auth (login)
from backend.app.auth.router import router as auth_router

# Empleados (CRUD completo)
from backend.app.empleados.router import router as empleados_router

# Maestros 
from backend.app.maestros.router import router as maestros_router

# Herramientas Swager
from backend.app.herramientasswager.crear_tablas import router as herramientas_router
from backend.app.herramientasswager.reset_intranet import router as reset_intranet_router

# CTN
from backend.app.ctn.router import router as ctn_router
from backend.app.Utilidades.router import router as utilidades_router

# Seguridad
from backend.app.seguridad.auditoria.router import router as seguridad_auditoria_router
from backend.app.seguridad.logs.router import router as seguridad_logs_router

# INTRANET ROUTERS
from backend.app.intranet.documentos.router import router as documentos_router
from backend.app.intranet.noticias.router import router as noticias_router

# MENSAJES
from backend.app.mensajes.router_ws import router as mensajes_ws_router

# ---------------------------------------------------------
# INCLUIR ROUTERS REST
# ---------------------------------------------------------

app.include_router(auth_router, prefix="/api")
app.include_router(empleados_router, prefix="/api")
app.include_router(maestros_router, prefix="/api")
app.include_router(herramientas_router, prefix="/api")
app.include_router(ctn_router, prefix="/api")
app.include_router(utilidades_router, prefix="/api")
app.include_router(seguridad_auditoria_router, prefix="/api")
app.include_router(seguridad_logs_router, prefix="/api")
app.include_router(documentos_router, prefix="/api")
app.include_router(reset_intranet_router, prefix="/api")
app.include_router(noticias_router, prefix="/api")
app.include_router(mensajes_ws_router)
