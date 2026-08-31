from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Set

router = APIRouter(prefix="/ws", tags=["empleados_ws"])

# Usamos un set para evitar duplicados y mejorar rendimiento
conexiones_empleados: Set[WebSocket] = set()


async def broadcast_empleados(evento: dict):
    """Enviar evento a todos los clientes conectados al WS de empleados."""
    conexiones_muertas = []

    for ws in conexiones_empleados:
        try:
            await ws.send_json(evento)
        except Exception:
            conexiones_muertas.append(ws)

    # Eliminar conexiones muertas
    for ws in conexiones_muertas:
        conexiones_empleados.discard(ws)


@router.websocket("/empleados")
async def empleados_ws(websocket: WebSocket):
    await websocket.accept()

    # Registrar conexión
    conexiones_empleados.add(websocket)

    # Enviar ACK al conectar
    await websocket.send_json({
        "tipo": "ws_conectado",
        "descripcion": "Conexión establecida con WS de empleados"
    })

    try:
        while True:
            try:
                data = await websocket.receive_json()

                # ⭐ IGNORAR HEARTBEAT
                if data.get("tipo") == "ping":
                    continue

                # Si algún día quieres procesar mensajes entrantes, aquí irían
                # print("[WS-EMP] Mensaje recibido:", data)

            except WebSocketDisconnect:
                break
            except Exception:
                continue

    except WebSocketDisconnect:
        pass

    finally:
        conexiones_empleados.discard(websocket)
