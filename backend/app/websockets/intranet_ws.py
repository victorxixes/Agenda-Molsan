# intranet_ws.py
# Versión ampliada y cerrada para mantener compatibilidad sin activar WebSockets

from typing import Dict, Any

# Diccionario de conexiones (vacío, pero estructurado)
intranet_connections: Dict[int, Any] = {}

async def intranet_connect(usuario_id: int, websocket):
    """
    Función preparada para futuro uso.
    Actualmente no se usa, pero mantiene compatibilidad.
    """
    # No aceptamos conexiones porque el módulo está cerrado
    pass

async def intranet_disconnect(usuario_id: int):
    """
    Función preparada para futuro uso.
    """
    if usuario_id in intranet_connections:
        del intranet_connections[usuario_id]

async def intranet_broadcast(evento: dict):
    """
    Función llamada desde otros módulos (documentos, noticias, etc.)
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
