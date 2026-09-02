from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# ---------------------------------------------------------
# DATABASE
# ---------------------------------------------------------
from backend.app.database import Base, engine

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

# ---------------------------------------------------------
# INCLUIR ROUTERS REST
# ---------------------------------------------------------

app.include_router(auth_router, prefix="/api")
app.include_router(empleados_router, prefix="/api")
app.include_router(maestros_router, prefix="/api")
app.include_router(herramientas_router, prefix="/api")
