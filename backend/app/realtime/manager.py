from typing import Dict, Set
from fastapi import WebSocket
from .schemas import RealtimeEvent


class RealtimeManager:
    def __init__(self):
        self.global_connections: Set[WebSocket] = set()
        self.user_connections: Dict[int, Set[WebSocket]] = {}
        self.role_connections: Dict[str, Set[WebSocket]] = {}
        self.module_connections: Dict[str, Set[WebSocket]] = {}
        self.group_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(
        self,
        websocket: WebSocket,
        usuario_id: int | None = None,
        rol: str | None = None,
        modulo: str | None = None,
        grupo: str | None = None,
    ):
        await websocket.accept()
        self.global_connections.add(websocket)

        if usuario_id is not None:
            self.user_connections.setdefault(usuario_id, set()).add(websocket)

        if rol is not None:
            self.role_connections.setdefault(rol, set()).add(websocket)

        if modulo is not None:
            self.module_connections.setdefault(modulo, set()).add(websocket)

        if grupo is not None:
            self.group_connections.setdefault(grupo, set()).add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.global_connections.discard(websocket)

        for d in (self.user_connections, self.role_connections,
                  self.module_connections, self.group_connections):
            for key in list(d.keys()):
                if websocket in d[key]:
                    d[key].discard(websocket)
                if not d[key]:
                    del d[key]

    async def _safe_send(self, ws: WebSocket, event: RealtimeEvent):
        try:
            await ws.send_json(event.dict())
        except Exception:
            self.disconnect(ws)

    async def broadcast_global(self, event: RealtimeEvent):
        for ws in list(self.global_connections):
            await self._safe_send(ws, event)

    async def broadcast_usuario(self, usuario_id: int, event: RealtimeEvent):
        for ws in list(self.user_connections.get(usuario_id, set())):
            await self._safe_send(ws, event)

    async def broadcast_rol(self, rol: str, event: RealtimeEvent):
        for ws in list(self.role_connections.get(rol, set())):
            await self._safe_send(ws, event)

    async def broadcast_modulo(self, modulo: str, event: RealtimeEvent):
        for ws in list(self.module_connections.get(modulo, set())):
            await self._safe_send(ws, event)

    async def broadcast_grupo(self, grupo: str, event: RealtimeEvent):
        for ws in list(self.group_connections.get(grupo, set())):
            await self._safe_send(ws, event)


realtime_manager = RealtimeManager()
