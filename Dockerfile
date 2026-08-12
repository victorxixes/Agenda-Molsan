FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# COPIAR TODO EL BACKEND DIRECTAMENTE A /app
COPY backend/app ./app
COPY backend/agenda ./agenda
COPY backend/ctn ./ctn
COPY backend/database.py ./database.py
COPY backend/config.py ./config.py

# Ejecutar FastAPI desde app/main.py
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]



