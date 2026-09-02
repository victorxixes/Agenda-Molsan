from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.ctn.service import listar_notarias, obtener_notaria
from backend.app.agenda.models import Cita

router = APIRouter(prefix="/ctn", tags=["CTN"])

@router.get("/notarias")
def listar(db: Session = Depends(get_db)):
    return listar_notarias(db)

@router.get("/notarias/{notaria_id}")
def obtener(notaria_id: int, db: Session = Depends(get_db)):
    return obtener_notaria(db, notaria_id)

@router.get("/notarias/{notaria_id}/firmas")
def contar_firmas(notaria_id: int, db: Session = Depends(get_db)):
    total = db.query(Cita).filter(Cita.notario_id == notaria_id).count()
    vc = db.query(Cita).filter(Cita.notario_id == notaria_id, Cita.tipo_cita == "VC").count()
    presencial = db.query(Cita).filter(Cita.notario_id == notaria_id, Cita.tipo_cita == "P").count()

    return {
        "notaria_id": notaria_id,
        "total_firmas": total,
        "total_vc": vc,
        "total_presencial": presencial
    }
