from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, time
from sqlalchemy import text

from backend.app.database import get_db

from backend.app.agenda.schemas import CitaCreate, CitaUpdate, CitaResponse
from backend.app.agenda.models import Cita


from backend.app.agenda.service import (
    listar_citas_dia,
    listar_citas_semana,
    listar_citas_mes,
    crear_cita,
    editar_cita,
    eliminar_cita,
    mover_cita,
    cambiar_estado_cita
)

router = APIRouter(prefix="/agenda", tags=["Agenda"])

from sqlalchemy import text

@router.post("/debug/remove-fk-notario")
def remove_fk_notario(db: Session = Depends(get_db)):
    db.execute(text("ALTER TABLE agenda_citas DROP CONSTRAINT IF EXISTS agenda_citas_notario_id_fkey;"))
    db.commit()
    return {"status": "OK", "message": "Foreign key notario_id eliminado"}

@router.post("/debug/remove-fk-apoderado")
def remove_fk_apoderado(db: Session = Depends(get_db)):
    db.execute(text("ALTER TABLE agenda_citas DROP CONSTRAINT IF EXISTS agenda_citas_apoderado_id_fkey;"))
    db.commit()
    return {"status": "OK", "message": "Foreign key apoderado_id eliminado"}

@router.post("/debug/recreate-table")
def recreate_table(db: Session = Depends(get_db)):
    db.execute(text("""
        DROP TABLE IF EXISTS agenda_citas CASCADE;
    """))

    db.execute(text("""
        CREATE TABLE agenda_citas (
            id SERIAL PRIMARY KEY,
            fecha DATE NOT NULL,
            hora_inicio TIME NOT NULL,
            hora_fin TIME NOT NULL,
            tipo_cita VARCHAR NOT NULL,
            notario_id INTEGER,
            tipo_firma VARCHAR,
            apoderado_id INTEGER,
            observaciones VARCHAR,
            estado VARCHAR DEFAULT 'Pendiente'
        );
    """))

    db.commit()
    return {"status": "OK", "message": "Tabla agenda_citas recreada correctamente"}

@router.get("/debug/schema")
def debug_schema(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='agenda_citas';"))
    return {"schema": [dict(row) for row in result]}
    
# ---------------------------------------------------------
# LISTAR CITAS
# ---------------------------------------------------------
@router.get("/dia/{fecha}")
def citas_dia(fecha: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(fecha)
    return listar_citas_dia(db, fecha_dt)

@router.get("/semana/{fecha}")
def citas_semana(fecha: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(fecha)
    return listar_citas_semana(db, fecha_dt)

@router.get("/mes/{year}/{month}")
def citas_mes(year: int, month: int, db: Session = Depends(get_db)):
    return listar_citas_mes(db, year, month)

# ---------------------------------------------------------
# CREAR CITA
# ---------------------------------------------------------
@router.post("/", response_model=CitaResponse)
def create_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    nueva = Cita(**cita.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


# ---------------------------------------------------------
# EDITAR CITA
# ---------------------------------------------------------
@router.put("/{id}")
def editar(id: int, data: CitaUpdate, db: Session = Depends(get_db)):
    return editar_cita(db, id, data)

# ---------------------------------------------------------
# ELIMINAR CITA
# ---------------------------------------------------------
@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    return eliminar_cita(db, id)

# ---------------------------------------------------------
# MOVER CITA (drag & drop)
# ---------------------------------------------------------
@router.put("/mover/{id}")
def mover(id: int, nueva_fecha: str, nueva_hora_inicio: str, nueva_hora_fin: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(nueva_fecha)
    hora_inicio_dt = time.fromisoformat(nueva_hora_inicio)
    hora_fin_dt = time.fromisoformat(nueva_hora_fin)
    return mover_cita(db, id, fecha_dt, hora_inicio_dt, hora_fin_dt)

# ---------------------------------------------------------
# CAMBIAR ESTADO
# ---------------------------------------------------------
@router.put("/estado/{id}")
def cambiar_estado(id: int, nuevo_estado: str, db: Session = Depends(get_db)):
    return cambiar_estado_cita(db, id, nuevo_estado)


