from sqlalchemy.orm import Session
from backend.app.ctn.models import Notaria

# ---------------------------------------------------------
# LISTAR NOTARIAS
# ---------------------------------------------------------
def listar_notarias(db: Session):
    return db.query(Notaria).order_by(Notaria.codigo.asc()).all()

# ---------------------------------------------------------
# OBTENER NOTARIA POR ID
# ---------------------------------------------------------
def obtener_notaria(db: Session, notaria_id: int):
    return db.query(Notaria).filter(Notaria.id == notaria_id).first()
