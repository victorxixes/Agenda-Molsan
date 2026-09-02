class WSManager:
    def __init__(self):
        self.conectados = {}  # empleado_id → websocket

    async def connect(self, websocket, empleado_id):
        await websocket.accept()
        self.conectados[empleado_id] = websocket

    def disconnect(self, empleado_id):
        if empleado_id in self.conectados:
            del self.conectados[empleado_id]

    async def enviar_mensaje_ws(self, remitente_id: int, destinatario_id: int, contenido: str):
        ws = self.conectados.get(destinatario_id)
        if ws:
            await ws.send_json({
                "tipo": "mensaje",
                "de": remitente_id,
                "contenido": contenido
            })

    async def enviar_notificacion(self, destinatario_id: int, evento: dict):
        ws = self.conectados.get(destinatario_id)
        if ws:
            await ws.send_json(evento)

manager = WSManager()
