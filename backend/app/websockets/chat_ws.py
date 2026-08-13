from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Any

router = APIRouter()

# Diccionario global de usuarios conectados
connected_users: Dict[int, WebSocket] = {}

@router.websocket("/ws/chat/{user_id}")
async def chat_ws(websocket: WebSocket, user_id: int):
    await websocket.accept()

    # Registrar usuario
    connected_users[user_id] = websocket
    print(f"Usuario conectado al WS: {user_id}")

    try:
        while True:
            data = await websocket.receive_json()

            tipo = data.get("tipo")
            texto = data.get("texto")
            remitente = data.get("remitente_id")
            destinatario = data.get("destinatario_id")

            # 🔥 Evento: typing
            if tipo == "typing":
                if destinatario in connected_users:
                    await connected_users[destinatario].send_json({
                        "tipo": "typing",
                        "remitente_id": remitente
                    })

            # 🔥 Evento: nuevo mensaje
            if tipo == "mensaje":
                # reenviar al destinatario si está conectado
                if destinatario in connected_users:
                    await connected_users[destinatario].send_json({
                        "tipo": "nuevo_mensaje",
                        "remitente_id": remitente,
                        "destinatario_id": destinatario,
                        "texto": texto
                    })

    except WebSocketDisconnect:
        print(f"Usuario desconectado del WS: {user_id}")

    finally:
        # eliminar usuario del diccionario
        if user_id in connected_users:
            del connected_users[user_id]
