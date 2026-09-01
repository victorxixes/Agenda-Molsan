from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.models import EventoSeguridad
from backend.app.seguridad.schemas import Evento
from backend.app.auth.dependencies import get_current_user
from backend.app.auth.permissions import require_permission

router = APIRouter(prefix="/seguridad/eventos", tags=["Seguridad - Eventos"])

@router.get("", response_model=list[Evento])
def listar_eventos(
    nivel: str | None = Query(None),
    usuario_id: int | None = Query(None),
    limite: int = Query(200),
    db: Session = Depends(get_db),
    usuario = Depends(get_current_user)
):
    # 🔥 Seguridad real
    require_permission(db, usuario, "seguridad.ver")

    query = db.query(EventoSeguridad)

    if nivel:
        query = query.filter(EventoSeguridad.detalle.ilike(f"%[{nivel.upper()}]%"))

    if usuario_id:
        query = query.filter(EventoSeguridad.usuario_id == usuario_id)

    eventos = (
        query.order_by(EventoSeguridad.creado_en.desc())
        .limit(limite)
        .all()
    )

    return eventos
