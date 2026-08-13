FROM python:3.11

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar SOLO el backend dentro de /app/backend
COPY backend /app/backend

# Instalar dependencias del backend
RUN pip install -r /app/backend/requirements.txt

# Comando de arranque
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "10000"]

