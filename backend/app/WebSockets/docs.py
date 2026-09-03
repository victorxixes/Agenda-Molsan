from fastapi import APIRouter

router_ws_docs = APIRouter(tags=["WebSockets"])

@router_ws_docs.get("/ws/mensajes/{empleado_id}")
def ws_doc(empleado_id: int):
    """
    Documentación de la ruta WebSocket.
    Esta ruta NO es HTTP. Solo aparece en Swagger.
    """
    return {"websocket": f"/ws/mensajes/{empleado_id}"}

websocket_docs = [
    {
        "name": "WebSockets",
        "description": (
            "### 📡 WebSockets disponibles\n\n"
            "#### 🔌 /ws/mensajes/{empleado_id}\n\n"
            "Conecta un empleado al sistema de mensajería en tiempo real.\n\n"
            "**Ejemplo de conexión:**\n"
            "```js\n"
            "let ws = new WebSocket(\"wss://agenda-intranet-b.onrender.com/ws/mensajes/1\");\n"
            "ws.onopen = () => console.log(\"WS conectado\");\n"
            "ws.onmessage = (e) => console.log(\"Mensaje:\", e.data);\n"
            "```\n"
        )
    }
]
