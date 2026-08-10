from pydantic import BaseModel
from typing import Any, Dict

# -----------------------------
# CHAT
# -----------------------------
class WSChatMessage(BaseModel):
    remitente_id: int
    destinatario_id: int
    mensaje: str
    tipo: str = "chat"

# -----------------------------
# AGENDA
# -----------------------------
class WSAgendaEvent(BaseModel):
    tipo: str  # cita_creada, cita_movida, cita_estado
    cita_id: int
    datos: Dict[str, Any]

# -----------------------------
# NOTIFICACIONES
# -----------------------------
class WSNotification(BaseModel):
    tipo: str  # documento, noticia, seguridad, logs
    mensaje: str
    datos: Dict[str, Any] | None = None

# -----------------------------
# DASHBOARD
# -----------------------------
class WSDashboardEvent(BaseModel):
    tipo: str  # resumen, actividad, métricas
    datos: Dict[str, Any]

# -----------------------------
# SEGURIDAD
# -----------------------------
class WSSecurityEvent(BaseModel):
    tipo: str  # rol_editado, permiso_asignado, usuario_bloqueado
    datos: Dict[str, Any]

# -----------------------------
# LOGS
# -----------------------------
class WSLogEvent(BaseModel):
    tipo: str  # log_creado
    datos: Dict[str, Any]
