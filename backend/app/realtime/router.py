from fastapi import APIRouter, WebSocket
from app.realtime.manager import ConnectionManager

router = APIRouter(prefix="/ws", tags=["Realtime"])
manager = ConnectionManager()

# ---------------------------------------------------------
# CHAT
# ---------------------------------------------------------
@router.websocket("/chat/{usuario_id}")
async def chat_ws(websocket: WebSocket, usuario_id: int):
    await manager.subscribe_user(usuario_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            await manager.send_to_user(data["destinatario_id"], data)
    except:
        await manager.unsubscribe_user(usuario_id, websocket)

# ---------------------------------------------------------
# NOTIFICACIONES
# ---------------------------------------------------------
@router.websocket("/notificaciones/{usuario_id}")
async def notificaciones_ws(websocket: WebSocket, usuario_id: int):
    await manager.subscribe_user(usuario_id, websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        await manager.unsubscribe_user(usuario_id, websocket)

# ---------------------------------------------------------
# AGENDA
# ---------------------------------------------------------
@router.websocket("/agenda")
async def agenda_ws(websocket: WebSocket):
    await manager.subscribe(websocket, "agenda")

    try:
        while True:
            await websocket.receive_text()
    except:
        await manager.unsubscribe(websocket, "agenda")

# ---------------------------------------------------------
# DASHBOARD
# ---------------------------------------------------------
@router.websocket("/dashboard")
async def dashboard_ws(websocket: WebSocket):
    await manager.subscribe(websocket, "dashboard")

    try:
        while True:
            await websocket.receive_text()
    except:
        await manager.unsubscribe(websocket, "dashboard")

# ---------------------------------------------------------
# SEGURIDAD
# ---------------------------------------------------------
@router.websocket("/seguridad")
async def seguridad_ws(websocket: WebSocket):
    await manager.subscribe(websocket, "seguridad")

    try:
        while True:
            await websocket.receive_text()
    except:
        await manager.unsubscribe(websocket, "seguridad")

# ---------------------------------------------------------
# LOGS
# ---------------------------------------------------------
@router.websocket("/logs")
async def logs_ws(websocket: WebSocket):
    await manager.subscribe(websocket, "logs")

    try:
        while True:
            await websocket.receive_text()
    except:
        await manager.unsubscribe(websocket, "logs")
