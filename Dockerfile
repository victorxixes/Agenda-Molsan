FROM python:3.11

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar TODO el backend (no solo backend/app)
COPY backend /app/backend

# Instalar dependencias
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Ejecutar FastAPI con uvicorn
CMD ["uvicorn", "backend.app.reset_db:app", "--host", "0.0.0.0", "--port", "10000"]
