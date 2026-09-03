websocket_docs = [
    {
        "name": "WebSockets",
        "description": """
### Rutas WebSocket disponibles

#### 📡 /ws/mensajes/{empleado_id}

Conecta un empleado al sistema de mensajería en tiempo real.

**Parámetros:**
- `empleado_id` (int): ID del empleado que se conecta.

**Ejemplo de conexión desde navegador:**
```js
let ws = new WebSocket("wss://agenda-intranet-b.onrender.com/ws/mensajes/1");

ws.onopen = () => console.log("WS conectado");
ws.onmessage = (e) => console.log("Mensaje:", e.data);
ws.onerror = (e) => console.log("Error:", e);
ws.onclose = () => console.log("WS cerrado");
