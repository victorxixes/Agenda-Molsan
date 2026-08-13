from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Any

router = APIRouter()

# Diccionario global de conexiones WebSocket
intranet_connections: Dict[int, WebSocket] = {}

@router.websocket("/ws/intranet")
async def intranet_ws(websocket: WebSocket):
    await websocket.accept()

    # Recibir primer mensaje: ID del usuario
    data = await websocket.receive_json()
    usuario_id = data.get("usuario_id")

    if not usuario_id:
        await websocket.close()
        return

    intranet_connections[usuario_id] = websocket
    print(f"Usuario conectado a INTRANET WS: {usuario_id}")

    try:
        while True:
            # Mantener conexión viva
            await websocket.receive_text()

    except WebSocketDisconnect:
        print(f"Usuario desconectado de INTRANET WS: {usuario_id}")

    finally:
        if usuario_id in intranet_connections:
            del intranet_connections[usuario_id]


async def intranet_broadcast(evento: dict):
    """Enviar evento a todos los usuarios conectados al WS de intranet."""
    for ws in intranet_connections.values():
        try:
            await ws.send_json(evento)
        except:
            pass
