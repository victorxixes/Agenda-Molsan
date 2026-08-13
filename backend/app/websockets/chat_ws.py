from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.database import get_db
from backend.app.mensajes.service import crear_mensaje
from sqlalchemy.orm import Session

router = APIRouter(prefix="/ws/chat", tags=["WebSocket Chat"])

conexiones = {}  # usuario_id → websocket

@router.websocket("/{usuario_id}")
async def chat_ws(websocket: WebSocket, usuario_id: int):
    await websocket.accept()
    conexiones[usuario_id] = websocket

    try:
        while True:
            data = await websocket.receive_json()

            # MENSAJE NORMAL
            if data["tipo"] == "mensaje":
                db: Session = next(get_db())
                nuevo = crear_mensaje(db, data)

                dest = data["destinatario_id"]
                if dest in conexiones:
                    await conexiones[dest].send_json({
                        "tipo": "mensaje",
                        "id": nuevo.id,
                        "mensaje": nuevo.mensaje,
                        "remitente_id": nuevo.remitente_id,
                        "destinatario_id": nuevo.destinatario_id,
                    })

            # TYPING
            if data["tipo"] == "typing":
                dest = data["destinatario_id"]
                if dest in conexiones:
                    await conexiones[dest].send_json({
                        "tipo": "typing",
                        "remitente_id": usuario_id
                    })

    except WebSocketDisconnect:
        conexiones.pop(usuario_id, None)
