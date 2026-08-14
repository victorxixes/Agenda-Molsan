FROM python:3.11

WORKDIR /app

# Copiar solo el backend
COPY backend /app/backend

# Instalar dependencias del backend
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

EXPOSE 10000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "10000"]


