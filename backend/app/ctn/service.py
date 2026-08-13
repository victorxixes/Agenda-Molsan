from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria
from backend.app.ctn.schemas import NotariaCreate


def listar_notarias(db: Session):
    return db.query(Notaria).all()


def obtener_notaria(db: Session, notaria_id: int):
    return db.query(Notaria).filter(Notaria.id == notaria_id).first()


def crear_notaria(db: Session, data: NotariaCreate):
    notaria = Notaria(**data.dict())
    db.add(notaria)
    db.commit()
    db.refresh(notaria)
    return notaria


def actualizar_notaria(db: Session, notaria_id: int, data: NotariaCreate):
    notaria = obtener_notaria(db, notaria_id)
    if not notaria:
        return None

    for k, v in data.dict().items():
        setattr(notaria, k, v)

    db.commit()
    db.refresh(notaria)
    return notaria


def eliminar_notaria(db: Session, notaria_id: int):
    notaria = obtener_notaria(db, notaria_id)
    if not notaria:
        return None

    db.delete(notaria)
    db.commit()
    return notaria
