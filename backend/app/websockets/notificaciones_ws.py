# notificaciones_ws.py
# Versión cerrada y compatible para evitar errores de import.
# No gestiona WebSockets reales, pero mantiene las funciones necesarias.

from typing import Dict, Any

# Diccionario de conexiones (vacío)
notificaciones_connections: Dict[int, Any] = {}

async def enviar_notificacion(usuario_id: int, evento: dict):
    """
    Función llamada desde otros módulos.
    Actualmente no envía nada, pero evita errores de import.
    """
    # Módulo cerrado: no enviamos nada
    pass

async def broadcast_notificacion(evento: dict):
    """
    Función llamada desde Documentos, Noticias, Dashboard.
    Actualmente no envía nada, pero evita errores de import.
    """
    # Módulo cerrado: no enviamos nada
    pass

async def notificaciones_connect(usuario_id: int, websocket):
    """
    Preparado para futuro uso.
    """
    pass

async def notificaciones_disconnect(usuario_id: int):
    """
    Preparado para futuro uso.
    """
    if usuario_id in notificaciones_connections:
        del notificaciones_connections[usuario_id]
