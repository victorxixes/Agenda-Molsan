from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# ---------------------------------------------------------
# DATABASE
# ---------------------------------------------------------
from app.database import Base, engine

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


# Auth
from backend.app.auth.router import router as auth_router

# Empleados / Maestros
from backend.app.empleados.router import router as empleados_router

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

# ---------------------------------------------------------
# INCLUIR ROUTERS REST
# ---------------------------------------------------------

app.include_router(auth_router, prefix="/api")

# Empleados / Maestros
app.include_router(empleados_router, prefix="/api")

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


ma=False)
app.include_router(seguridad_ws_router, include_in_schema=False)
