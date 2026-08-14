FROM python:3.11
# rebuild


WORKDIR /app

# Copiar SOLO el backend completo
COPY backend /app/backend

# Instalar dependencias del backend
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Arrancar FastAPI desde la ruta correcta
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "10000"]
