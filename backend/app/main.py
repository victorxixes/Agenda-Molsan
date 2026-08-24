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
# SOLO EMPLEADOS
# ---------------------------------------------------------
from backend.app.empleados.router import router as empleados_router
app.include_router(empleados_router, prefix="/api")

# ---------------------------------------------------------
# STATIC FILES
# ---------------------------------------------------------
FOTOS_DIR = os.path.join(os.path.dirname(__file__), "fotos")
app.mount("/fotos", StaticFiles(directory=FOTOS_DIR), name="fotos")
