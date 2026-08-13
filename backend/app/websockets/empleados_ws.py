from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()

# Diccionario global de empleados conectados
empleados_conectados: Dict[int, WebSocket] = {}

@router.websocket("/ws/empleados")
async def empleados_ws(websocket: WebSocket):
    await websocket.accept()

    # Recibir el primer mensaje: el ID del empleado
    try:
        data = await websocket.receive_json()
    except Exception:
        await websocket.close()
        return

    empleado_id = data.get("empleado_id")

    if not empleado_id:
        await websocket.close()
        return

    # Registrar empleado
    empleados_conectados[empleado_id] = websocket
    print(f"[WS-EMP] Conectado: {empleado_id}")

    # Notificar conexión
    await broadcast({
        "tipo": "empleado_conectado",
        "empleado_id": empleado_id
    })

    try:
        while True:
            # Mantener la conexión viva
            try:
                await websocket.receive_text()
            except Exception:
                # Ignorar mensajes basura
                continue

    except WebSocketDisconnect:
        print(f"[WS-EMP] Desconectado: {empleado_id}")

    finally:
        # Eliminar del diccionario
        if empleado_id in empleados_conectados:
            del empleados_conectados[empleado_id]

        # Notificar desconexión
        await broadcast({
            "tipo": "empleado_desconectado",
            "empleado_id": empleado_id
        })


async def broadcast(message: dict):
    """Enviar mensaje a todos los empleados conectados."""
    for ws in list(empleados_conectados.values()):
        try:
            await ws.send_json(message)
        except Exception:
            pass
