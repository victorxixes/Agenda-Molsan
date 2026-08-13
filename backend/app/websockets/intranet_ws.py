from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()

# Diccionario global de conexiones WebSocket
intranet_connections: Dict[int, WebSocket] = {}

@router.websocket("/ws/intranet")
async def intranet_ws(websocket: WebSocket):
    await websocket.accept()

    # Recibir primer mensaje: ID del usuario
    try:
        data = await websocket.receive_json()
    except Exception:
        await websocket.close()
        return

    usuario_id = data.get("usuario_id")

    if not usuario_id:
        await websocket.close()
        return

    intranet_connections[usuario_id] = websocket
    print(f"[WS-INTRANET] Conectado: {usuario_id}")

    try:
        while True:
            try:
                await websocket.receive_text()
            except Exception:
                continue

    except WebSocketDisconnect:
        print(f"[WS-INTRANET] Desconectado: {usuario_id}")

    finally:
        if usuario_id in intranet_connections:
            del intranet_connections[usuario_id]


async def intranet_broadcast(evento: dict):
    """Enviar evento a todos los usuarios conectados al WS de intranet."""
    for ws in list(intranet_connections.values()):
        try:
            await ws.send_json(evento)
        except Exception:
            pass
