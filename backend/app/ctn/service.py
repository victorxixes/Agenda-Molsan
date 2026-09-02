from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria
from backend.app.ctn.schemas import NotariaCreate, NotariaUpdate

# ---------------------------------------------------------
# LISTAR NOTARIAS
# ---------------------------------------------------------
def listar_notarias(db: Session):
    return db.query(Notaria).all()

# ---------------------------------------------------------
# OBTENER NOTARIA
# ---------------------------------------------------------
def obtener_notaria(db: Session, notaria_id: int):
    return db.query(Notaria).filter(Notaria.id == notaria_id).first()
