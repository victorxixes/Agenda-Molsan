from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()

# Diccionario global de empleados conectados
empleados_conectados: Dict[int, WebSocket] = {}

@router.websocket("/ws/empleados")
async def empleados_ws(websocket: WebSocket):
    await websocket.accept()

    # Recibir el primer mensaje: el ID del empleado
    data = await websocket.receive_json()
    empleado_id = data.get("empleado_id")

    if not empleado_id:
        await websocket.close()
        return

    # Registrar empleado
    empleados_conectados[empleado_id] = websocket
    print(f"Empleado conectado: {empleado_id}")

    # Notificar a todos que este empleado está conectado
    await broadcast({
        "tipo": "empleado_conectado",
        "empleado_id": empleado_id
    })

    try:
        while True:
            # Mantener la conexión viva
            await websocket.receive_text()

    except WebSocketDisconnect:
        print(f"Empleado desconectado: {empleado_id}")

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
    for ws in empleados_conectados.values():
        try:
            await ws.send_json(message)
        except:
            pass
