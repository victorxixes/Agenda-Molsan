from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict

router = APIRouter()

# Diccionario global de usuarios conectados
connected_users: Dict[int, WebSocket] = {}

@router.websocket("/ws/chat/{user_id}")
async def chat_ws(websocket: WebSocket, user_id: int):
    await websocket.accept()

    # Registrar usuario
    connected_users[user_id] = websocket
    print(f"[WS-CHAT] Usuario conectado: {user_id}")

    try:
        while True:
            try:
                data = await websocket.receive_json()
            except Exception:
                # Si el cliente envía texto o basura, ignoramos
                continue

            tipo = data.get("tipo")
            remitente = data.get("remitente_id")
            destinatario = data.get("destinatario_id")
            texto = data.get("texto")

            # Validación mínima
            if not tipo:
                continue

            # ---------------------------------------------------------
            # 🔥 Evento: typing
            # ---------------------------------------------------------
            if tipo == "typing":
                if destinatario in connected_users:
                    try:
                        await connected_users[destinatario].send_json({
                            "tipo": "typing",
                            "remitente_id": remitente
                        })
                    except Exception:
                        pass

            # ---------------------------------------------------------
            # 🔥 Evento: nuevo mensaje
            # ---------------------------------------------------------
            if tipo == "mensaje":
                if destinatario in connected_users:
                    try:
                        await connected_users[destinatario].send_json({
                            "tipo": "nuevo_mensaje",
                            "remitente_id": remitente,
                            "destinatario_id": destinatario,
                            "texto": texto
                        })
                    except Exception:
                        pass

    except WebSocketDisconnect:
        print(f"[WS-CHAT] Usuario desconectado: {user_id}")

    finally:
        # Eliminar usuario del diccionario
        if user_id in connected_users:
            del connected_users[user_id]
            print(f"[WS-CHAT] Usuario eliminado del registro: {user_id}")
