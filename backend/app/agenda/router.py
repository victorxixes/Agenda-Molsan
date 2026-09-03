from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, time

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
    obtener_cita
)

from backend.app.auth.dependencies import get_current_user
from backend.app.auth.permissions import require_permission

router = APIRouter(prefix="/agenda", tags=["Agenda"])


# ---------------------------------------------------------
# BORRAR TABLA agenda_citas
# ---------------------------------------------------------
@router.delete("/__drop_table_agenda_citas__")
def drop_table_agenda_citas(db: Session = Depends(get_db)):
    db.execute("DROP TABLE IF EXISTS agenda_citas CASCADE;")
    db.commit()
    return {"status": "agenda_citas borrada"}


# ---------------------------------------------------------
# CHEQUEAR TABLA
# ---------------------------------------------------------
@router.get("/__check_table_agenda_citas__")
def check_table_agenda_citas(db: Session = Depends(get_db)):
    result = db.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'agenda_citas'
        );
    """)
    exists = result.scalar()
    return {"agenda_citas_exists": exists}


# ---------------------------------------------------------
# CREAR TABLA
# ---------------------------------------------------------
@router.post("/__create_table_agenda_citas__")
def create_table_agenda_citas(db: Session = Depends(get_db)):
    db.execute("""
        CREATE TABLE IF NOT EXISTS agenda_citas (
            id SERIAL PRIMARY KEY,
            fecha DATE NOT NULL,
            hora_inicio TIME NOT NULL,
            hora_fin TIME NOT NULL,
            tipo_cita VARCHAR NOT NULL,

            vc VARCHAR,
            observacion VARCHAR,
            apoderado_s VARCHAR,

            notario_id INTEGER REFERENCES ctn_notarios(id),
            apoderado_id INTEGER REFERENCES empleados(id)
        );
    """)
    db.commit()
    return {"status": "agenda_citas creada correctamente"}

# ---------------------------------------------------------
# DESCRIBE TABLE
# ---------------------------------------------------------
@router.get("/__describe_table_agenda_citas__")
def describe_table_agenda_citas(db: Session = Depends(get_db)):
    result = db.execute("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'agenda_citas'
        ORDER BY ordinal_position;
    """)
    columns = [row[0] for row in result]
    return {"columns": columns}


# ---------------------------------------------------------
# ALTER TABLE
# ---------------------------------------------------------
@router.post("/__alter_table_agenda_citas__")
def alter_table_agenda_citas(db: Session = Depends(get_db)):
    db.execute("ALTER TABLE agenda_citas ADD COLUMN IF NOT EXISTS vc VARCHAR;")
    db.execute("ALTER TABLE agenda_citas ADD COLUMN IF NOT EXISTS observacion VARCHAR;")
    db.execute("ALTER TABLE agenda_citas ADD COLUMN IF NOT EXISTS apoderado_s VARCHAR;")
    db.commit()
    return {"status": "agenda_citas actualizada"}


# ---------------------------------------------------------
# BUSCADOR
# ---------------------------------------------------------
@router.get("/search", response_model=list[CitaResponse])
def buscar_citas(
    query: str | None = None,
    notario_id: int | None = None,
    apoderado_id: int | None = None,
    tipo_cita: str | None = None,
    fecha: str | None = None,
    desde: str | None = None,
    hasta: str | None = None,
    db: Session = Depends(get_db)
):
    q = db.query(Cita)

    if query:
        query_lower = f"%{query.lower()}%"
        q = q.filter(
            (Cita.tipo_cita.ilike(query_lower)) |
            (Cita.observacion.ilike(query_lower)) |
            (Cita.apoderado_s.ilike(query_lower))
        )

    if notario_id:
        q = q.filter(Cita.notario_id == notario_id)

    if apoderado_id:
        q = q.filter(Cita.apoderado_id == apoderado_id)

    if tipo_cita:
        q = q.filter(Cita.tipo_cita.ilike(f"%{tipo_cita}%"))

    if fecha:
        fecha_dt = date.fromisoformat(fecha)
        q = q.filter(Cita.fecha == fecha_dt)

    if desde:
        desde_dt = date.fromisoformat(desde)
        q = q.filter(Cita.fecha >= desde_dt)

    if hasta:
        hasta_dt = date.fromisoformat(hasta)
        q = q.filter(Cita.fecha <= hasta_dt)

    citas = q.order_by(Cita.fecha.asc(), Cita.hora_inicio.asc()).all()
    return [cita_con_relaciones(db, c) for c in citas]


# ---------------------------------------------------------
# OBTENER UNA CITA
# ---------------------------------------------------------
@router.get("/{id}", response_model=CitaResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    cita = obtener_cita(db, id)
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita


# ---------------------------------------------------------
# LISTAR CITAS
# ---------------------------------------------------------
@router.get("/dia/{fecha}", response_model=list[CitaResponse])
def citas_dia(fecha: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(fecha)
    return listar_citas_dia(db, fecha_dt)


@router.get("/semana/{fecha}", response_model=list[CitaResponse])
def citas_semana(fecha: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(fecha)
    return listar_citas_semana(db, fecha_dt)


@router.get("/mes/{year}/{month}", response_model=list[CitaResponse])
def citas_mes(year: int, month: int, db: Session = Depends(get_db)):
    return listar_citas_mes(db, year, month)


# ---------------------------------------------------------
# CREAR CITA
# ---------------------------------------------------------
@router.post("/", response_model=CitaResponse)
def create_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    return crear_cita(db, cita)


# ---------------------------------------------------------
# EDITAR CITA
# ---------------------------------------------------------
@router.put("/{id}", response_model=CitaResponse)
def editar(id: int, data: CitaUpdate, db: Session = Depends(get_db)):
    editada = editar_cita(db, id, data)
    if not editada:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return editada


# ---------------------------------------------------------
# ELIMINAR CITA
# ---------------------------------------------------------
@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    res = eliminar_cita(db, id)
    if not res:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return {"detail": "Cita eliminada correctamente"}


# ---------------------------------------------------------
# MOVER CITA
# ---------------------------------------------------------
@router.put("/mover/{id}", response_model=CitaResponse)
def mover(id: int, nueva_fecha: str, nueva_hora_inicio: str, nueva_hora_fin: str, db: Session = Depends(get_db)):
    fecha_dt = date.fromisoformat(nueva_fecha)
    hora_inicio_dt = time.fromisoformat(nueva_hora_inicio)
    hora_fin_dt = time.fromisoformat(nueva_hora_fin)

    movida = mover_cita(db, id, fecha_dt, hora_inicio_dt, hora_fin_dt)
    if not movida:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    return movida

# ---------------------------------------------------------
# MIS CITAS
# ---------------------------------------------------------
@router.get("/mis-citas", response_model=list[CitaResponse])
def mis_citas(
    db: Session = Depends(get_db),
    empleado = Depends(get_current_user)
):
    empleado_id = empleado.id
    return db.query(Cita).filter(Cita.apoderado_id == empleado_id).all()

