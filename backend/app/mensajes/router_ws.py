from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import json

from backend.app.database import SessionLocal
from backend.app.empleados.models import Empleado
from backend.app.mensajes.ws_manager import manager

router = APIRouter()

@router.websocket("/ws/mensajes/{empleado_id}")
async def mensajes_ws(websocket: WebSocket, empleado_id: int):
    db: Session = SessionLocal()

    await manager.connect(websocket, empleado_id)
    print(f"[WS-MSG] Conectado: {empleado_id}")

    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()

    await manager.broadcast({
        "tipo": "online",
        "id": empleado.id,
        "nombre": empleado.nombre,
        "apellidos": empleado.apellidos,
        "foto": empleado.foto
    })

    try:
        while True:
            try:
                msg = await websocket.receive_text()

                if msg == "ping":
                    continue

                try:
                    data = json.loads(msg)
                except:
                    continue

                tipo = data.get("tipo")

                if tipo == "typing":
                    destinatario_id = data.get("destinatario_id")

                    await manager.send_to_user(destinatario_id, {
                        "tipo": "typing",
                        "from": empleado_id
                    })

                elif tipo == "mensaje":
                    remitente_id = empleado_id
                    destinatario_id = data.get("destinatario_id")
                    contenido = data.get("contenido")

                    await manager.enviar_mensaje_ws(remitente_id, destinatario_id, contenido)

                elif tipo == "archivo":
                    remitente_id = empleado_id
                    destinatario_id = data.get("destinatario_id")
                    archivo_url = data.get("archivo_url")

                    await manager.enviar_archivo_ws(remitente_id, destinatario_id, archivo_url)

            except WebSocketDisconnect:
                break

            except Exception:
                continue

    finally:
        print(f"[WS-MSG] Desconectado: {empleado_id}")
        manager.disconnect(empleado_id)

        await manager.broadcast({
            "tipo": "offline",
            "id": empleado.id
        })

        db.close()
