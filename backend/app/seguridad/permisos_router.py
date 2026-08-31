from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.empleados.models import Empleado

router = APIRouter(prefix="/seguridad", tags=["Seguridad"])

@router.get("/permisos/{empleado_id}")
def permisos_por_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # modulos_visibles: lista de strings
    modulos = empleado.modulos_visibles or []

    # permisos_modulo: dict modulo -> lista de acciones
    acciones = empleado.permisos_modulo or {}

    return {
        "empleado_id": empleado_id,
        "rol_id": empleado.rol_id,
        "modulos": modulos,
        "acciones": acciones,
    }

@router.get("/modulos/{empleado_id}")
def modulos_por_empleado(empleado_id: int, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    return {
        "empleado_id": empleado_id,
        "modulos": empleado.modulos_visibles or [],
    }
