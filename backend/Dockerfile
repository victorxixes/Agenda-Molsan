FROM python:3.11

WORKDIR /app

# Copiar solo el backend
COPY backend /app

# Instalar dependencias del backend
RUN pip install --no-cache-dir -r /app/requirements.txt

# Arrancar FastAPI desde la ruta correcta
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]



