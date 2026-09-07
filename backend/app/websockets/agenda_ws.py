from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

# SIN prefix, definimos la ruta completa en el decorator
router = APIRouter(tags=["Agenda WebSocket"])


class AgendaWebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)


manager = AgendaWebSocketManager()


@router.websocket("/ws/agenda")
async def agenda_ws(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            # Mantener conexión abierta; si no esperas mensajes, usa receive_text()
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
