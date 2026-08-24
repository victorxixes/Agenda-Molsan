from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()

notificaciones_connections: Dict[int, WebSocket] = {}


@router.websocket("/ws/notificaciones/{usuario_id}")
async def notificaciones_ws(websocket: WebSocket, usuario_id: int):
    await websocket.accept()

    notificaciones_connections[usuario_id] = websocket
    print(f"[WS-NOTIF] Conectado: {usuario_id}")

    try:
        while True:
            try:
                await websocket.receive_text()
            except Exception:
                continue

    except WebSocketDisconnect:
        print(f"[WS-NOTIF] Desconectado: {usuario_id}")

    finally:
        if usuario_id in notificaciones_connections:
            del notificaciones_connections[usuario_id]


async def enviar_notificacion(usuario_id: int, evento: dict):
    ws = notificaciones_connections.get(usuario_id)
    if ws:
        try:
            await ws.send_json(evento)
        except Exception:
            pass


async def broadcast_notificacion(evento: dict):
    for ws in list(notificaciones_connections.values()):
        try:
            await ws.send_json(evento)
        except Exception:
            pass
