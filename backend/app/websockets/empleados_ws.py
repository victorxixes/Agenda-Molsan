from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()

empleados_conectados: Dict[int, WebSocket] = {}


@router.websocket("/ws/empleados")
async def empleados_ws(websocket: WebSocket):
    await websocket.accept()

    try:
        data = await websocket.receive_json()
    except Exception:
        await websocket.close()
        return

    empleado_id = data.get("empleado_id")
    if not empleado_id:
        await websocket.close()
        return

    empleados_conectados[empleado_id] = websocket
    print(f"[WS-EMP] Conectado: {empleado_id}")

    await broadcast({
        "tipo": "empleado_conectado",
        "empleado_id": empleado_id
    })

    try:
        while True:
            try:
                await websocket.receive_text()
            except Exception:
                continue

    except WebSocketDisconnect:
        print(f"[WS-EMP] Desconectado: {empleado_id}")

    finally:
        if empleado_id in empleados_conectados:
            del empleados_conectados[empleado_id]

        await broadcast({
            "tipo": "empleado_desconectado",
            "empleado_id": empleado_id
        })


async def broadcast(message: dict):
    for ws in list(empleados_conectados.values()):
        try:
            await ws.send_json(message)
        except Exception:
            pass
