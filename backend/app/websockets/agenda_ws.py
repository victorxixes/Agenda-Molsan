from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter(prefix="/ws/agenda", tags=["Agenda WebSocket"])


# =========================================================
# MANAGER — controla conexiones y envíos
# =========================================================
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
                # Si falla una conexión, se elimina
                self.disconnect(connection)


manager = AgendaWebSocketManager()


# =========================================================
# ROUTER — WebSocket principal
# =========================================================
@router.websocket("/")
async def agenda_ws(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            # Agenda no recibe mensajes del cliente,
            # solo mantiene la conexión abierta.
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(websocket)
