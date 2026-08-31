from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()

intranet_connections: Dict[int, WebSocket] = {}


@router.websocket("/ws/intranet")
async def intranet_ws(websocket: WebSocket):
    await websocket.accept()

    try:
        # Esperar el primer mensaje del cliente
        data = await websocket.receive_json()
        usuario_id = data.get("usuario_id")

        if not usuario_id:
            await websocket.close()
            return

        intranet_connections[usuario_id] = websocket
        print(f"[WS-INTRANET] Conectado: {usuario_id}")

        # Mantener la conexión abierta
        while True:
            try:
                await websocket.receive_text()
            except WebSocketDisconnect:
                break
            except Exception:
                continue

    except WebSocketDisconnect:
        print(f"[WS-INTRANET] Desconectado: {usuario_id}")

    finally:
        intranet_connections.pop(usuario_id, None)


async def intranet_broadcast(evento: dict):
    for ws in list(intranet_connections.values()):
        try:
            await ws.send_json(evento)
        except Exception:
            pass
