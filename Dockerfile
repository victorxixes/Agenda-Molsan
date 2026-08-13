FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copiar backend
COPY backend ./backend

# Ejecutar prestart y luego arrancar FastAPI
CMD ["bash", "-c", "python backend/prestart.py && uvicorn backend.app.main:app --host 0.0.0.0 --port 10000"]



