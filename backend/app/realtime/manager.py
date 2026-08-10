from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Conexiones por canal
        self.channels: Dict[str, List[WebSocket]] = {
            "chat": [],
            "notificaciones": [],
            "agenda": [],
            "dashboard": [],
            "seguridad": [],
            "logs": []
        }

        # Conexiones por usuario
        self.user_channels: Dict[int, List[WebSocket]] = {}

    # ---------------------------------------------------------
    # SUSCRIPCIÓN A CANALES
    # ---------------------------------------------------------
    async def subscribe(self, websocket: WebSocket, canal: str):
        await websocket.accept()
        self.channels.setdefault(canal, []).append(websocket)

    async def unsubscribe(self, websocket: WebSocket, canal: str):
        if canal in self.channels and websocket in self.channels[canal]:
            self.channels[canal].remove(websocket)

    # ---------------------------------------------------------
    # SUSCRIPCIÓN POR USUARIO
    # ---------------------------------------------------------
    async def subscribe_user(self, usuario_id: int, websocket: WebSocket):
        await websocket.accept()
        self.user_channels.setdefault(usuario_id, []).append(websocket)

    async def unsubscribe_user(self, usuario_id: int, websocket: WebSocket):
        if usuario_id in self.user_channels:
            if websocket in self.user_channels[usuario_id]:
                self.user_channels[usuario_id].remove(websocket)

    # ---------------------------------------------------------
    # ENVÍO A CANAL
    # ---------------------------------------------------------
    async def send_to_channel(self, canal: str, message: dict):
        if canal in self.channels:
            for ws in self.channels[canal]:
                await ws.send_json(message)

    # ---------------------------------------------------------
    # ENVÍO A USUARIO
    # ---------------------------------------------------------
    async def send_to_user(self, usuario_id: int, message: dict):
        if usuario_id in self.user_channels:
            for ws in self.user_channels[usuario_id]:
                await ws.send_json(message)

    # ---------------------------------------------------------
    # ENVÍO A TODOS
    # ---------------------------------------------------------
    async def broadcast(self, message: dict):
        for canal in self.channels.values():
            for ws in canal:
                await ws.send_json(message)
