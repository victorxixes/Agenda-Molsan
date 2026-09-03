# backend/app/WebSockets/docs.py

from fastapi import APIRouter

# Router fantasma para documentar WebSockets en Swagger
router_ws_docs = APIRouter(tags=["WebSockets"])

@router_ws_docs.get("/ws/mensajes/{empleado_id}")
def ws_doc(empleado_id: int):
    """
    Documentación de la ruta WebSocket.
    Esta ruta NO es HTTP. Solo aparece en Swagger.
    """
    return {"websocket": f"/ws/mensajes/{empleado_id}"}

# Tags para Swagger
websocket_docs = [
    {
        "name": "WebSockets",
        "description": """
### 📡 WebSockets disponibles

#### 🔌 /ws/mensajes/{empleado_id}

Conecta un empleado al sistema de mensajería en tiempo real.

**Ejemplo de conexión:**
```js
let ws = new WebSocket("wss://agenda-intranet-b.onrender.com/ws/mensajes/1");
ws.onopen = () => console.log("WS conectado");
ws.onmessage = (e) => console.log("Mensaje:", e.data);
