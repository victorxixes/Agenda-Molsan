from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.mensajes.ws_manager import manager

router = APIRouter()

@router.websocket("/ws/mensajes/{empleado_id}")
async def mensajes_ws(websocket: WebSocket, empleado_id: int):
    # Conectar usuario
    await manager.connect(websocket, empleado_id)
    print(f"[WS-MSG] Conectado: {empleado_id}")

    # Notificar a todos que este usuario está online
    await manager.broadcast({
        "tipo": "online",
        "user_id": empleado_id
    })

    try:
        while True:
            try:
                # Recibir texto (más tolerante que JSON)
                msg = await websocket.receive_text()

                # Si el frontend envía "ping"
                if msg == "ping":
                    continue

                # Intentar parsear JSON
                try:
                    data = json.loads(msg)
                except:
                    continue

                tipo = data.get("tipo")

                # ---------------------------------------------------------
                # 1) USUARIO ESCRIBIENDO
                # ---------------------------------------------------------
                if tipo == "typing":
                    destinatario_id = data.get("destinatario_id")

                    await manager.send_to_user(destinatario_id, {
                        "tipo": "typing",
                        "from": empleado_id
                    })

                # ---------------------------------------------------------
                # 2) ENVÍO DE MENSAJE DE TEXTO
                # ---------------------------------------------------------
                elif tipo == "mensaje":
                    remitente_id = empleado_id
                    destinatario_id = data.get("destinatario_id")
                    contenido = data.get("contenido")

                    await manager.enviar_mensaje_ws(remitente_id, destinatario_id, contenido)

                    await manager.send_to_user(destinatario_id, {
                        "tipo": "nuevo_mensaje",
                        "de": remitente_id,
                        "contenido": contenido
                    })

                # ---------------------------------------------------------
                # 3) ENVÍO DE ARCHIVO
                # ---------------------------------------------------------
                elif tipo == "archivo":
                    remitente_id = empleado_id
                    destinatario_id = data.get("destinatario_id")
                    archivo_url = data.get("archivo_url")

                    await manager.enviar_archivo_ws(remitente_id, destinatario_id, archivo_url)

                    await manager.send_to_user(destinatario_id, {
                        "tipo": "nuevo_archivo",
                        "de": remitente_id,
                        "archivo_url": archivo_url
                    })

            except WebSocketDisconnect:
                break

            except Exception:
                continue

    finally:
        print(f"[WS-MSG] Desconectado: {empleado_id}")
        manager.disconnect(empleado_id)

        await manager.broadcast({
            "tipo": "offline",
            "user_id": empleado_id
        })
