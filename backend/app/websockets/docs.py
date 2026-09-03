from fastapi import APIRouter

router_ws_docs = APIRouter(tags=["WebSockets"])

@router_ws_docs.get("/ws/mensajes/{empleado_id}")
def ws_doc(empleado_id: int):
    """
    Documentación de la ruta WebSocket:
    /ws/mensajes/{empleado_id}

    Esta ruta NO es HTTP. Solo aparece en Swagger para documentación.
    """
    return {"websocket": f"/ws/mensajes/{empleado_id}"}

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

