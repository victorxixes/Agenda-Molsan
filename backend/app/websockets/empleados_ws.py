from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from typing import Set
import asyncio
import jwt
from backend.app.config import settings

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


@router.websocket("/empleados/{empleado_id}")
async def empleados_ws(websocket: WebSocket, empleado_id: int):
    # 🔥 1) Leer token desde query param
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001)
        return

    # 🔥 2) Validar token
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        usuario_id = payload.get("id")

        if usuario_id is None:
            await websocket.close(code=4002)
            return

    except Exception:
        await websocket.close(code=4003)
        return

    # 🔥 3) Aceptar conexión
    await websocket.accept()
    conexiones_empleados.add(websocket)

    # ACK inicial
    await websocket.send_json({
        "tipo": "ws_conectado",
        "empleado_id": empleado_id,
        "usuario_id": usuario_id
    })

    try:
        while True:
            try:
                msg = await asyncio.wait_for(websocket.receive_text(), timeout=5)

                if msg == "ping":
                    await websocket.send_text("pong")
                    continue

            except asyncio.TimeoutError:
                continue

            except WebSocketDisconnect:
                break

            except Exception:
                continue

    finally:
        conexiones_empleados.discard(websocket)
