# intranet_ws.py
# Versión cerrada y compatible para evitar errores de import
# No gestiona WebSockets reales, pero mantiene las funciones necesarias.

from typing import Dict, Any

# Diccionario de conexiones (vacío)
intranet_connections: Dict[int, Any] = {}

async def intranet_connect(usuario_id: int, websocket):
    """
    Función preparada para futuro uso.
    Actualmente no se usa, pero mantiene compatibilidad.
    """
    # Módulo cerrado: no aceptamos conexiones
    pass

async def intranet_disconnect(usuario_id: int):
    """
    Función preparada para futuro uso.
    """
    if usuario_id in intranet_connections:
        del intranet_connections[usuario_id]

async def intranet_broadcast(evento: dict):
    """
    Función llamada desde otros módulos (documentos, noticias, dashboard).
    Actualmente no envía nada, pero evita errores de import.
    """
    # Módulo cerrado: no enviamos nada
    pass

async def intranet_send(usuario_id: int, evento: dict):
    """
    Enviar evento a un usuario concreto.
    Preparado para futuro uso.
    """
    ws = intranet_connections.get(usuario_id)
    if ws:
        try:
            await ws.send_json(evento)
        except Exception:
            pass
