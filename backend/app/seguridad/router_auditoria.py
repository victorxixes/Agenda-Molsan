from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.models import Auditoria
from backend.app.seguridad.schemas import AuditoriaOut
from backend.app.auth.dependencies import get_current_user
from backend.app.auth.permissions import require_permission

router = APIRouter(prefix="/seguridad/auditoria", tags=["Seguridad - Auditoría"])

@router.get("", response_model=list[AuditoriaOut])
def listar_auditoria(
    modulo: str | None = Query(None),
    usuario_id: int | None = Query(None),
    limite: int = Query(200),
    db: Session = Depends(get_db),
    usuario = Depends(get_current_user)
):
    # 🔥 Seguridad real
    require_permission(db, usuario, "seguridad.ver")

    query = db.query(Auditoria)

    if modulo:
        query = query.filter(Auditoria.modulo == modulo)

    if usuario_id:
        query = query.filter(Auditoria.usuario_id == usuario_id)

    registros = (
        query.order_by(Auditoria.creado_en.desc())
        .limit(limite)
        .all()
    )

    return registros

