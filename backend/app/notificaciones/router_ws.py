from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from threading import Lock

router_notif = APIRouter(prefix="/ws", tags=["notificaciones_ws"])

# conexiones = { empleado_id: [ws1, ws2, ...] }
conexiones = {}
lock = Lock()


async def send_notif_to_user(empleado_id: int, data: dict):
    """Enviar notificación a un usuario (todas sus pestañas)."""
    with lock:
        lista = conexiones.get(empleado_id, [])

    muertos = []

    for ws in lista:
        try:
            await ws.send_json(data)
        except Exception:
            muertos.append(ws)

    # Limpieza
    if muertos:
        with lock:
            for ws in muertos:
                try:
                    lista.remove(ws)
                except:
                    pass


@router_notif.websocket("/notificaciones/{empleado_id}")
async def ws_notificaciones(websocket: WebSocket, empleado_id: int):
    # 🔥 Render exige aceptar la conexión ANTES de cualquier validación
    await websocket.accept()

    # Registrar conexión
    with lock:
        if empleado_id not in conexiones:
            conexiones[empleado_id] = []
        conexiones[empleado_id].append(websocket)

    print(f"[WS-NOTIF] Conectado {empleado_id}")

    try:
        while True:
            # 🔥 Render envía pings automáticos → ignorarlos
            try:
                msg = await websocket.receive_text()
            except WebSocketDisconnect:
                break
            except Exception:
                continue

            if msg == "ping":
                continue

            # No procesamos nada, este WS solo recibe notificaciones
            continue

    finally:
        print(f"[WS-NOTIF] Desconectado {empleado_id}")

        with lock:
            try:
                conexiones[empleado_id].remove(websocket)
            except:
                pass
