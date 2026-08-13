from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()

# Diccionario global de conexiones por usuario
notificaciones_connections: Dict[int, WebSocket] = {}

@router.websocket("/ws/notificaciones/{usuario_id}")
async def notificaciones_ws(websocket: WebSocket, usuario_id: int):
    await websocket.accept()

    # Registrar usuario
    notificaciones_connections[usuario_id] = websocket
    print(f"Usuario conectado a NOTIFICACIONES WS: {usuario_id}")

    try:
        while True:
            # Mantener conexión viva
            await websocket.receive_text()

    except WebSocketDisconnect:
        print(f"Usuario desconectado de NOTIFICACIONES WS: {usuario_id}")

    finally:
        if usuario_id in notificaciones_connections:
            del notificaciones_connections[usuario_id]


async def enviar_notificacion(usuario_id: int, evento: dict):
    """Enviar notificación a un usuario específico."""
    ws = notificaciones_connections.get(usuario_id)
    if ws:
        try:
            await ws.send_json(evento)
        except:
            pass


async def broadcast_notificacion(evento: dict):
    """Enviar notificación a todos los usuarios conectados."""
    for ws in notificaciones_connections.values():
        try:
            await ws.send_json(evento)
        except:
            pass
