from datetime import datetime
from sqlalchemy.orm import Session
from threading import Lock

from backend.app.mensajes.models import Mensaje
from backend.app.database import SessionLocal


class WSManager:
    conectados = {}
    lock = Lock()

    async def connect(self, websocket, empleado_id):
        await websocket.accept()
        with self.lock:
            self.conectados[empleado_id] = websocket

    def disconnect(self, empleado_id):
        with self.lock:
            self.conectados.pop(empleado_id, None)

    async def send_to_user(self, empleado_id, data):
        ws = self.conectados.get(empleado_id)
        if ws:
            await ws.send_json(data)

    async def broadcast(self, data):
        for ws in list(self.conectados.values()):
            try:
                await ws.send_json(data)
            except Exception:
                continue

    async def enviar_mensaje_ws(self, remitente_id: int, destinatario_id: int, contenido: str):
        db: Session = SessionLocal()

        mensaje = Mensaje(
            remitente_id=remitente_id,
            destinatario_id=destinatario_id,
            contenido=contenido,
            archivo_url=None,
            fecha=datetime.now(),
            leido=False
        )

        db.add(mensaje)
        db.commit()
        db.refresh(mensaje)
        db.close()

        payload = {
            "tipo": "mensaje",
            "mensaje": mensaje.as_dict()
        }

        await self.send_to_user(remitente_id, payload)
        await self.send_to_user(destinatario_id, payload)

        return mensaje

    async def enviar_archivo_ws(self, remitente_id: int, destinatario_id: int, archivo_url: str):
        db: Session = SessionLocal()

        mensaje = Mensaje(
            remitente_id=remitente_id,
            destinatario_id=destinatario_id,
            contenido=None,
            archivo_url=archivo_url,
            fecha=datetime.now(),
            leido=False
        )

        db.add(mensaje)
        db.commit()
        db.refresh(mensaje)
        db.close()

        payload = {
            "tipo": "archivo",
            "mensaje": mensaje.as_dict()
        }

        await self.send_to_user(remitente_id, payload)
        await self.send_to_user(destinatario_id, payload)

        return mensaje


manager = WSManager()
