from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from backend.app.database_ws import get_db_ws

router = APIRouter(prefix="/ws/chat", tags=["WebSocket Chat"])

# usuario_id → websocket
conexiones = {}


# ⭐ Broadcast typing para la lista de conectados
async def broadcast_typing(usuario_id: int):
    for uid, ws in conexiones.items():
        try:
            await ws.send_json({
                "tipo": "typing_estado",
                "usuario_id": usuario_id
            })
        except:
            pass


@router.websocket("/{usuario_id}")
async def chat_ws(websocket: WebSocket, usuario_id: int):
    # Importar aquí para evitar carga temprana de modelos
    from backend.app.mensajes.service import crear_mensaje

    await websocket.accept()
    conexiones[usuario_id] = websocket

    try:
        while True:
            data = await websocket.receive_json()

            # ⭐ IGNORAR HEARTBEAT
            if data.get("tipo") == "ping":
                continue

            # ⭐ MENSAJE NORMAL
            if data.get("tipo") == "mensaje":
                db: Session = Depends(get_db_ws)
                nuevo = crear_mensaje(db, data)

                dest = data.get("destinatario_id")
                if dest in conexiones:
                    await conexiones[dest].send_json({
                        "tipo": "mensaje",
                        "id": nuevo.id,
                        "mensaje": nuevo.mensaje,
                        "remitente_id": nuevo.remitente_id,
                        "destinatario_id": nuevo.destinatario_id,
                    })

            # ⭐ TYPING
            if data.get("tipo") == "typing":
                dest = data.get("destinatario_id")

                # typing al destinatario
                if dest in conexiones:
                    await conexiones[dest].send_json({
                        "tipo": "typing",
                        "remitente_id": usuario_id
                    })

                # typing a todos los conectados (lista de conectados)
                await broadcast_typing(usuario_id)

    except WebSocketDisconnect:
        conexiones.pop(usuario_id, None)
