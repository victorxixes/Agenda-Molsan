from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio

router = APIRouter()


@router.websocket("/ws/seguridad")
async def seguridad_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json({"status": "ok"})
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        pass
