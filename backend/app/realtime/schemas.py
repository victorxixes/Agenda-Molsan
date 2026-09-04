from pydantic import BaseModel
from typing import Optional, Dict, Any


class RealtimeEvent(BaseModel):
    modulo: str              # "agenda", "mensajes", "intranet", "notificaciones", "seguridad", "dashboard"
    evento: str              # "cita_creada", "mensaje_nuevo", etc.
    usuario_id: Optional[int] = None
    rol: Optional[str] = None
    grupo: Optional[str] = None
    data: Dict[str, Any] = {}
