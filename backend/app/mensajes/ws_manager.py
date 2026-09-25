from datetime import datetime
from sqlalchemy.orm import Session
from threading import Lock

from backend.app.mensajes.models import Mensaje
from backend.app.database import SessionLocal

# 🔥 Import correcto del WS de notificaciones
from backend.app.notificaciones.router_ws import send_notif_to_user


class WSManager:
    """
    Gestor WebSocket SJ‑2026:
    - Conexiones por usuario (múltiples pestañas)
    - Broadcast seguro
    - Envío realtime de mensajes y archivos
    - Tiping realtime
    - Online/offline
    - Limpieza de conexiones muertas
    """

    conectados = {}  # {empleado_id: [ws1, ws2, ...]}
    lock = Lock()

    # ---------------------------------------------------------
    # CONECTAR
    # ---------------------------------------------------------
    async def connect(self, websocket, empleado_id):
        await websocket.accept()

        with self.lock:
            if empleado_id not in self.conectados:
                self.conectados[empleado_id] = []
            self.conectados[empleado_id].append(websocket)

    # ---------------------------------------------------------
    # DESCONECTAR
    # ---------------------------------------------------------
    def disconnect(self, empleado_id):
        with self.lock:
            self.conectados.pop(empleado_id, None)

    # ---------------------------------------------------------
    # ENVIAR A UN USUARIO
    # ---------------------------------------------------------
    async def send_to_user(self, empleado_id, data):
        conexiones = self.conectados.get(empleado_id, [])
        muertos = []

        for ws in conexiones:
            try:
                await ws.send_json(data)
            except Exception:
                muertos.append(ws)

        # Limpieza
        if muertos:
            with self.lock:
                for ws in muertos:
                    try:
                        conexiones.remove(ws)
                    except:
                        pass

    # ---------------------------------------------------------
    # BROADCAST GLOBAL
    # ---------------------------------------------------------
    async def broadcast(self, data):
        muertos = []

        for empleado_id, conexiones in self.conectados.items():
            for ws in conexiones:
                try:
                    await ws.send_json(data)
                except Exception:
                    muertos.append((empleado_id, ws))

        # Limpieza
        if muertos:
            with self.lock:
                for empleado_id, ws in muertos:
                    try:
                        self.conectados[empleado_id].remove(ws)
                    except:
                        pass

    # ---------------------------------------------------------
    # GUARDAR + ENVIAR MENSAJE
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

        payload = {
            "tipo": "nuevo_mensaje",
            "mensaje": mensaje.as_dict()
        }

        # 🔥 Enviar realtime al remitente
        await self.send_to_user(remitente_id, payload)

        # 🔥 Enviar realtime al destinatario
        await self.send_to_user(destinatario_id, payload)

        # 🔔 Notificación global
        await send_notif_to_user(destinatario_id, {
            "tipo": "nuevo_mensaje",
            "from": remitente_id,
            "preview": contenido,
        })

        return mensaje

    # ---------------------------------------------------------
    # GUARDAR + ENVIAR ARCHIVO
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

        payload = {
            "tipo": "nuevo_archivo",
            "mensaje": mensaje.as_dict()
        }

        # 🔥 Enviar realtime al remitente
        await self.send_to_user(remitente_id, payload)

        # 🔥 Enviar realtime al destinatario
        await self.send_to_user(destinatario_id, payload)

        # 🔔 Notificación global
        await send_notif_to_user(destinatario_id, {
            "tipo": "nuevo_archivo",
            "from": remitente_id,
            "archivo_url": archivo_url,
        })

        return mensaje


# Instancia global
manager = WSManager()
