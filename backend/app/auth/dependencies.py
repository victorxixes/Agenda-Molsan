from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt

from backend.app.config import settings
from backend.app.database import get_db
from backend.app.empleados.models import Empleado
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ---------------------------------------------------------
# FUNCIÓN QUE YA TENÍAS (NO SE TOCA)
# ---------------------------------------------------------
def obtener_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        empleado_id = payload.get("id")

        empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
        if not empleado:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        return {
            "id": empleado.id,
            "usuario": empleado.usuario,
            "rol_id": empleado.rol_id,
            "rol_nombre": empleado.rol.nombre if empleado.rol else None,
            "modulos_visibles": empleado.modulos_visibles_list or [],
            "permisos_modulo": empleado.permisos_modulo_dict or {},
        }

    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


# ---------------------------------------------------------
# FUNCIÓN QUE FALTABA (SEGURIDAD LA NECESITA)
# ---------------------------------------------------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    🔥 Esta función devuelve el OBJETO Empleado real,
    no un dict, para que Seguridad pueda acceder a:
    - rol
    - permisos del rol
    - módulos del rol
    - herencia de permisos
    - auditoría
    - eventos
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        empleado_id = payload.get("id")

        empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
        if not empleado:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")

        return empleado

    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
