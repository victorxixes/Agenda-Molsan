from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Base de datos
from backend.app.database import Base, engine

# Routers
from backend.app.mensajes.router import router as mensajes_router
from backend.app.mensajes.router_ws import router as mensajes_ws_router
from backend.app.WebSockets.docs import router_ws_docs

from backend.app.agenda.router import router as agenda_router
from backend.app.empleados.router import router as empleados_router
from backend.app.intranet.router import router as intranet_router
from backend.app.seguridad.router import router as seguridad_router
from backend.app.ctn.router import router as ctn_router

# =========================================================
# CREAR TABLAS AUTOMÁTICAMENTE (incluye MENSAJES)
# =========================================================
Base.metadata.create_all(bind=engine)

# =========================================================
# APP FASTAPI
# =========================================================
app = FastAPI(
    title="Agenda Intranet",
    version="1.0.0"
)

# =========================================================
# CORS PARA RENDER
# =========================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agenda-intranet-f.onrender.com",  # FRONTEND
        "http://localhost:5173",                   # DEV
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# ROUTERS HTTP (REST)
# =========================================================
app.include_router(mensajes_router, prefix="/api")
app.include_router(agenda_router, prefix="/api")
app.include_router(empleados_router, prefix="/api")
app.include_router(intranet_router, prefix="/api")
app.include_router(seguridad_router, prefix="/api")
app.include_router(ctn_router, prefix="/api")

# =========================================================
# ROUTERS WEBSOCKET
# =========================================================
app.include_router(mensajes_ws_router)
app.include_router(router_ws_docs)

# =========================================================
# DEBUG: LISTAR TABLAS
# =========================================================
@app.get("/debug/tablas")
def listar_tablas():
    return {"tablas": list(Base.metadata.tables.keys())}
