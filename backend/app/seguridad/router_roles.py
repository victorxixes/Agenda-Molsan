# ---------------------------------------------------------
# ROUTER SEGURO Y ESTABLE PARA ROLES
# ---------------------------------------------------------

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.service import crear_rol, listar_roles
from backend.app.seguridad.schemas import RolCreate, RolOut

router = APIRouter(
    prefix="/seguridad",
    tags=["Seguridad - Roles"],
    redirect_slashes=False   # 🔥 evita redirecciones que rompen CORS
)

# ---------------------------------------------------------
# LISTAR ROLES
# ---------------------------------------------------------
@router.get("/roles", response_model=list[RolOut])
def get_roles(db: Session = Depends(get_db)):
    return listar_roles(db)

# ---------------------------------------------------------
# CREAR ROL
# ---------------------------------------------------------
@router.post("/roles", response_model=RolOut)
def post_rol(data: RolCreate, db: Session = Depends(get_db)):
    return crear_rol(db, data)
