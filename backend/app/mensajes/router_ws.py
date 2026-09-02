from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.mensajes.ws_manager import manager

router = APIRouter(prefix="/ws/mensajes", tags=["Mensajes WS"])

@router.websocket("/{empleado_id}")
async def websocket_endpoint(websocket: WebSocket, empleado_id: int):
    await manager.connect(websocket, empleado_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(empleado_id, data)
    except WebSocketDisconnect:
        manager.disconnect(empleado_id)
