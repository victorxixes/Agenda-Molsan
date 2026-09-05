from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/debug",
    tags=["Debug"]
)

@router.delete("/drop/roles")
def drop_roles(db: Session = Depends(get_db)):
    db.execute("DROP TABLE IF EXISTS roles;")
    db.commit()
    return {"estado": "OK", "detalle": "Tabla roles eliminada"}
