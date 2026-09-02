class WSManager:
    def __init__(self):
        self.conectados = {}  # empleado_id → websocket

    async def connect(self, websocket, empleado_id):
        await websocket.accept()
        self.conectados[empleado_id] = websocket

    def disconnect(self, empleado_id):
        if empleado_id in self.conectados:
            del self.conectados[empleado_id]

manager = WSManager()
