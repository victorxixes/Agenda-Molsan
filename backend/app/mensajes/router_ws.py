from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.mensajes.ws_manager import manager

router = APIRouter(prefix="/ws/mensajes", tags=["Mensajes WS"])

@router.websocket("/{empleado_id}")
async def mensajes_ws(websocket: WebSocket, empleado_id: int):
    await manager.connect(websocket, empleado_id)

    try:
        while True:
            await websocket.receive_text()  # aún no procesamos mensajes
    except WebSocketDisconnect:
        manager.disconnect(empleado_id)
