from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from .manager import realtime_manager
from .schemas import RealtimeEvent

router = APIRouter(prefix="/ws/realtime", tags=["Realtime"])


@router.websocket("/")
async def realtime_ws(
    websocket: WebSocket,
    usuario_id: int | None = Query(default=None),
    rol: str | None = Query(default=None),
    modulo: str | None = Query(default=None),
    grupo: str | None = Query(default=None),
):
    await realtime_manager.connect(
        websocket,
        usuario_id=usuario_id,
        rol=rol,
        modulo=modulo,
        grupo=grupo,
    )

    try:
        while True:
            # Si en el futuro quieres que el cliente envíe eventos:
            # raw = await websocket.receive_json()
            # event = RealtimeEvent(**raw)
            # (procesar si hace falta)
            await websocket.receive_text()
    except WebSocketDisconnect:
        realtime_manager.disconnect(websocket)
