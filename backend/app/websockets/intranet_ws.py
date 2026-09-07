from typing import Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["Intranet WebSocket"])

# Diccionario de conexiones (por si en el futuro quieres usarlo)
intranet_connections: Dict[int, WebSocket] = {}


@router.websocket("/intranet")
async def intranet_ws(websocket: WebSocket):
    """
    WebSocket de intranet: ahora mismo no hace nada útil,
    pero mantiene la conexión viva para que el frontend
    no reviente al intentar conectar.
    """
    await websocket.accept()

    try:
        while True:
            # Mantener la conexión abierta; ignoramos mensajes
            await websocket.receive_text()
    except WebSocketDisconnect:
        # Cerramos conexión limpia
        pass


async def intranet_connect(usuario_id: int, websocket: WebSocket):
    """
    Función preparada para futuro uso.
    Actualmente no se usa, pero mantiene compatibilidad.
    """
    intranet_connections[usuario_id] = websocket


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
    # Módulo cerrado: no enviamos nada por ahora.
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
            # Silenciamos errores para no romper el flujo
            pass
