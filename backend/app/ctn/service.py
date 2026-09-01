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


# ---------------------------------------------------------
# CREAR NOTARIA
# ---------------------------------------------------------
def crear_notaria(db: Session, data: NotariaCreate):
    notaria = Notaria(**data.dict())
    db.add(notaria)
    db.commit()
    db.refresh(notaria)
    return notaria


# ---------------------------------------------------------
# ACTUALIZAR NOTARIA (SEGURO)
# ---------------------------------------------------------
def actualizar_notaria(db: Session, notaria_id: int, data: NotariaUpdate):
    notaria = obtener_notaria(db, notaria_id)
    if not notaria:
        return None

    # Solo actualizar campos enviados
    update_data = data.dict(exclude_unset=True)

    # Filtrar solo atributos válidos del modelo
    for campo, valor in update_data.items():
        if hasattr(Notaria, campo):
            setattr(notaria, campo, valor)

    db.commit()
    db.refresh(notaria)
    return notaria


# ---------------------------------------------------------
# ELIMINAR NOTARIA
# ---------------------------------------------------------
def eliminar_notaria(db: Session, notaria_id: int):
    notaria = obtener_notaria(db, notaria_id)
    if not notaria:
        return False

    db.delete(notaria)
    db.commit()
    return True
