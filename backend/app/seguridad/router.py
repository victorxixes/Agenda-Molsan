from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.seguridad.service import crear_rol, listar_roles
from app.seguridad.schemas import RolCreate

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("/")
def get_roles(db: Session = Depends(get_db)):
    return listar_roles(db)

@router.post("/")
def post_rol(data: RolCreate, db: Session = Depends(get_db)):
    return crear_rol(db, data)
