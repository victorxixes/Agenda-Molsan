class WSManager:
    def __init__(self):
        self.conectados = {}  # {empleado_id: websocket}

    async def connect(self, websocket, empleado_id):
        await websocket.accept()
        self.conectados[empleado_id] = websocket

    def disconnect(self, empleado_id):
        self.conectados.pop(empleado_id, None)

    async def send_to_user(self, empleado_id, data):
        ws = self.conectados.get(empleado_id)
        if ws:
            await ws.send_json(data)

    async def broadcast(self, data):
        for ws in self.conectados.values():
            await ws.send_json(data)

    async def enviar_mensaje_ws(self, remitente_id, destinatario_id, contenido):
        # Guardar en BD
        from backend.app.mensajes.service import guardar_mensaje_ws
        mensaje = guardar_mensaje_ws(remitente_id, destinatario_id, contenido)

        # Enviar al remitente
        await self.send_to_user(remitente_id, {
            "tipo": "mensaje",
            "mensaje": mensaje
        })

        # Enviar al destinatario
        await self.send_to_user(destinatario_id, {
            "tipo": "mensaje",
            "mensaje": mensaje
        })

manager = WSManager()
