FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# COPIAR TODO EL BACKEND
COPY backend ./backend

# Ejecutar FastAPI desde backend/app/main.py
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "10000"]



