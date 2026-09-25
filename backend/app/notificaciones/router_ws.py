from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from threading import Lock

router = APIRouter()

conectados_notif = {}
lock_notif = Lock()

async def connect_notif(websocket: WebSocket, empleado_id: int):
    await websocket.accept()
    with lock_notif:
        if empleado_id not in conectados_notif:
            conectados_notif[empleado_id] = []
        conectados_notif[empleado_id].append(websocket)

def disconnect_notif(empleado_id: int):
    with lock_notif:
        conectados_notif.pop(empleado_id, None)

async def send_notif_to_user(empleado_id: int, data: dict):
    conexiones = conectados_notif.get(empleado_id, [])
    muertos = []

    for ws in conexiones:
        try:
            await ws.send_json(data)
        except Exception:
            muertos.append(ws)

    if muertos:
        with lock_notif:
            for ws in muertos:
                try:
                    conexiones.remove(ws)
                except:
                    pass

router_notif = APIRouter(prefix="/ws", tags=["notificaciones_ws"])

@router_notif.websocket("/notificaciones/{empleado_id}")
async def notificaciones_ws(websocket: WebSocket, empleado_id: int):
    await connect_notif(websocket, empleado_id)

    try:
        while True:
            try:
                msg = await websocket.receive_text()
                if msg == "ping":
                    continue
            except WebSocketDisconnect:
                break
            except Exception:
                continue
    finally:
        disconnect_notif(empleado_id)
