from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio

router = APIRouter()


@router.websocket("/ws/seguridad")
async def seguridad_ws(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            # ⭐ Intentar recibir mensajes del cliente (ping)
            try:
                data = await websocket.receive_json()

                # ⭐ IGNORAR HEARTBEAT
                if data.get("tipo") == "ping":
                    pass

            except Exception:
                # Ignorar errores de lectura
                pass

            # ⭐ Enviar estado cada 3 segundos
            await websocket.send_json({"status": "ok"})
            await asyncio.sleep(3)

    except WebSocketDisconnect:
        pass
