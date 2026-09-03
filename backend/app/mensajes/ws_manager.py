from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.mensajes.models import Mensaje
from backend.app.database import SessionLocal


class WSManager:
    def __init__(self):
        # empleado_id → websocket
        self.conectados = {}

    # ---------------------------------------------------------
    # CONECTAR / DESCONECTAR
    # ---------------------------------------------------------
    async def connect(self, websocket, empleado_id):
        await websocket.accept()
        self.conectados[empleado_id] = websocket

    def disconnect(self, empleado_id):
        self.conectados.pop(empleado_id, None)

    # ---------------------------------------------------------
    # ENVIAR A UN USUARIO
    # ---------------------------------------------------------
    async def send_to_user(self, empleado_id, data):
        ws = self.conectados.get(empleado_id)
        if ws:
            await ws.send_json(data)

    # ---------------------------------------------------------
    # BROADCAST GLOBAL
    # ---------------------------------------------------------
    async def broadcast(self, data):
        for ws in self.conectados.values():
            await ws.send_json(data)

    # ---------------------------------------------------------
    # GUARDAR Y ENVIAR MENSAJE DE TEXTO
    # ---------------------------------------------------------
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

        # Enviar al remitente
        await self.send_to_user(remitente_id, {
            "tipo": "mensaje",
            "mensaje": mensaje.as_dict()
        })

        # Enviar al destinatario
        await self.send_to_user(destinatario_id, {
            "tipo": "mensaje",
            "mensaje": mensaje.as_dict()
        })

        return mensaje

    # ---------------------------------------------------------
    # GUARDAR Y ENVIAR ARCHIVO (PDF, Word, imagen…)
    # ---------------------------------------------------------
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

        # Enviar al remitente
        await self.send_to_user(remitente_id, {
            "tipo": "archivo",
            "mensaje": mensaje.as_dict()
        })

        # Enviar al destinatario
        await self.send_to_user(destinatario_id, {
            "tipo": "archivo",
            "mensaje": mensaje.as_dict()
        })

        return mensaje


manager = WSManager()
