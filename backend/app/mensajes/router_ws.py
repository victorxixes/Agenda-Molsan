from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.mensajes.ws_manager import manager

router = APIRouter()

@router.websocket("/ws/mensajes/{empleado_id}")
async def mensajes_ws(websocket: WebSocket, empleado_id: int):
    await manager.connect(websocket, empleado_id)
    print(f"[WS-MSG] Conectado: {empleado_id}")

    try:
        while True:
            data = await websocket.receive_json()

            if data.get("tipo") == "mensaje":
                remitente_id = empleado_id
                destinatario_id = data.get("destinatario_id")
                contenido = data.get("contenido")

                await manager.enviar_mensaje_ws(remitente_id, destinatario_id, contenido)

                await manager.enviar_notificacion(destinatario_id, {
                    "tipo": "nuevo_mensaje",
                    "de": remitente_id,
                    "contenido": contenido
                })

    except WebSocketDisconnect:
        print(f"[WS-MSG] Desconectado: {empleado_id}")
        manager.disconnect(empleado_id)
