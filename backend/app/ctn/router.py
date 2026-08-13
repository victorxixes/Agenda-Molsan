from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from backend.app.database import get_db

from backend.app.ctn.service import (
    listar_notarias,
    obtener_notaria,
    crear_notaria,
    actualizar_notaria,
    eliminar_notaria
)

from backend.app.ctn.schemas import NotariaCreate
from backend.app.ctn.importer import importar_excel_ctn

# IMPORTANTE: importar el modelo Notaria
from backend.app.ctn.models import Notaria

# IMPORTANTE: importar el modelo Cita
from backend.app.agenda.models import Cita

router = APIRouter(prefix="/ctn", tags=["CTN"])

# ---------------------------------------------------------
# FIRMAS / CITAS POR NOTARÍA
# ---------------------------------------------------------
@router.get("/notarias/{notaria_id}/firmas")
def contar_firmas(notaria_id: int, db: Session = Depends(get_db)):
    total = db.query(Cita).filter(Cita.notaria_id == notaria_id).count()
    vc = db.query(Cita).filter(Cita.notaria_id == notaria_id, Cita.tipo == "VC").count()
    presencial = db.query(Cita).filter(Cita.notaria_id == notaria_id, Cita.tipo == "P").count()

    return {
        "notaria_id": notaria_id,
        "total_firmas": total,
        "total_vc": vc,
        "total_presencial": presencial
    }

# ---------------------------------------------------------
# CRUD NOTARÍAS
# ---------------------------------------------------------
@router.get("/notarias")
def listar(db: Session = Depends(get_db)):
    return listar_notarias(db)

@router.get("/notarias/{notaria_id}")
def obtener(notaria_id: int, db: Session = Depends(get_db)):
    return obtener_notaria(db, notaria_id)

@router.post("/notarias")
def crear(data: NotariaCreate, db: Session = Depends(get_db)):
    return crear_notaria(db, data)

@router.put("/notarias/{notaria_id}")
def actualizar(notaria_id: int, data: NotariaCreate, db: Session = Depends(get_db)):
    return actualizar_notaria(db, notaria_id, data)

@router.delete("/notarias/{notaria_id}")
def eliminar(notaria_id: int, db: Session = Depends(get_db)):
    return eliminar_notaria(db, notaria_id)

# ---------------------------------------------------------
# IMPORTAR EXCEL
# ---------------------------------------------------------
@router.post("/importar-excel")
def importar_excel(file: UploadFile = File(...), db: Session = Depends(get_db)):
    return importar_excel_ctn(db, file)

# ---------------------------------------------------------
# LIMPIAR NOTARÍAS VACÍAS
# ---------------------------------------------------------
@router.delete("/limpiar-vacias")
def limpiar_notarias_vacias(db: Session = Depends(get_db)):
    eliminadas = db.query(Notaria).filter(
        (Notaria.codigo == "") |
        (Notaria.nombre == "") |
        (Notaria.provincia == "") |
        (Notaria.municipio == "") |
        (Notaria.nif == "")
    ).delete(synchronize_session=False)

    db.commit()
    return {"eliminadas": eliminadas}
