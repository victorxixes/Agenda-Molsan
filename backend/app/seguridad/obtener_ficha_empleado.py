from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db

router = APIRouter(
    prefix="/empleados",
    tags=["Empleados - Seguridad Completa"]
)

@router.get("/{empleado_id}/seguridad-completa")
def seguridad_completa(empleado_id: int, db: Session = Depends(get_db)):

    # Obtener datos del empleado
    empleado = db.execute("""
        SELECT id, nombre, apellido, email, activo, foto, rol_id,
               modulos_visibles_list, permisos_modulo_dict
        FROM empleados
        WHERE id = :id
    """, {"id": empleado_id}).fetchone()

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # Obtener rol
    rol = db.execute("""
        SELECT id, nombre
        FROM roles
        WHERE id = :id
    """, {"id": empleado.rol_id}).fetchone()

    # Construir respuesta
    return {
        "empleado": {
            "id": empleado.id,
            "nombre": empleado.nombre,
            "apellido": empleado.apellido,
            "email": empleado.email,
            "activo": empleado.activo,
            "foto": empleado.foto,
            "rol": rol.nombre if rol else None
        },
        "modulos_visibles": empleado.modulos_visibles_list,
        "permisos_modulo": empleado.permisos_modulo_dict
    }
