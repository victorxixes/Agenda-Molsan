from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Set

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
            try:
                # Recibir texto (más tolerante que JSON)
                msg = await websocket.receive_text()

                # Si el frontend envía "ping"
                if msg == "ping":
                    continue

            except WebSocketDisconnect:
                break

            except Exception:
                # Ignorar mensajes corruptos o vacíos
                continue

    finally:
        conexiones_empleados.discard(websocket)

