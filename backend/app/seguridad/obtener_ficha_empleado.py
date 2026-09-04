from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/seguridad",
    tags=["Seguridad - Ficha Completa Empleado"]
)

@router.get("/empleado/{empleado_id}/ficha-completa")
def obtener_ficha_completa(empleado_id: int, db: Session = Depends(get_db)):

    empleado = db.execute("""
        SELECT id, nombre, apellidos, email, activo, foto, rol_id,
               modulos_visibles_list, permisos_modulo_dict
        FROM empleados
        WHERE id = :id
    """, {"id": empleado_id}).fetchone()

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    rol = db.execute("""
        SELECT id, nombre
        FROM roles
        WHERE id = :id
    """, {"id": empleado.rol_id}).fetchone()

    rol_dict = None
    if rol:
        rol_dict = {
            "id": rol.id,
            "nombre": rol.nombre
        }

    return {
        "empleado": {
            "id": empleado.id,
            "nombre": empleado.nombre,
            "apellidos": empleado.apellidos,
            "email": empleado.email,
            "activo": empleado.activo,
            "foto": empleado.foto,
            "rol": rol_dict
        },
        "modulos_visibles": empleado.modulos_visibles_list or [],
        "permisos_modulo": empleado.permisos_modulo_dict or {}
    }
