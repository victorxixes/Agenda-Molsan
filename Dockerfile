FROM python:3.11

WORKDIR /app

# Copiar el backend COMPLETO
COPY backend/app /app/backend/app
COPY backend/requirements.txt /app/backend/requirements.txt

RUN pip install --no-cache-dir -r /app/backend/requirements.txt

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "10000"]
