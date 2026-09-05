from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Set
import asyncio

router = APIRouter(prefix="/ws", tags=["empleados_ws"])

conexiones_empleados: Set[WebSocket] = set()

async def broadcast_empleados(evento: dict):
    conexiones_muertas = []
    for ws in conexiones_empleados:
        try:
            await ws.send_json(evento)
        except:
            conexiones_muertas.append(ws)

    for ws in conexiones_muertas:
        conexiones_empleados.discard(ws)


@router.websocket("/empleados")
async def empleados_ws(websocket: WebSocket):
    await websocket.accept()
    conexiones_empleados.add(websocket)

    # ACK inicial
    await websocket.send_json({"tipo": "ws_conectado"})

    try:
        while True:
            # Intentar recibir sin bloquear
            try:
                msg = await asyncio.wait_for(websocket.receive_text(), timeout=5)

                if msg == "ping":
                    await websocket.send_text("pong")
                    continue

            except asyncio.TimeoutError:
                # No llegó nada → mantener conexión viva
                continue

            except WebSocketDisconnect:
                break

            except Exception:
                continue

    finally:
        conexiones_empleados.discard(websocket)
