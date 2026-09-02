class WSManager:
    def __init__(self):
        self.conectados = {}  # empleado_id → websocket

    async def connect(self, websocket, empleado_id):
        await websocket.accept()
        self.conectados[empleado_id] = websocket

    def disconnect(self, empleado_id):
        if empleado_id in self.conectados:
            del self.conectados[empleado_id]

    async def broadcast(self, remitente_id, mensaje):
        for empleado_id, ws in self.conectados.items():
            if empleado_id != remitente_id:
                await ws.send_text(mensaje)

manager = WSManager()
