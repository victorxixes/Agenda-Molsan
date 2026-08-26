
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
from datetime import datetime

router = APIRouter(prefix="/ws", tags=["empleados_ws"])

conexiones_empleados: List[WebSocket] = []


async def broadcast_empleados(evento: dict):
  """Enviar evento a todos los clientes conectados al WS de empleados."""
  for ws in conexiones_empleados:
    try:
      await ws.send_json(evento)
    except:
      # si falla, lo ignoramos y seguimos
      pass


@router.websocket("/empleados")
async def empleados_ws(websocket: WebSocket):
  await websocket.accept()
  conexiones_empleados.append(websocket)

  try:
    while True:
      # si quieres recibir mensajes del cliente:
      await websocket.receive_text()
  except WebSocketDisconnect:
    conexiones_empleados.remove(websocket)
  except Exception:
    if websocket in conexiones_empleados:
      conexiones_empleados.remove(websocket)
