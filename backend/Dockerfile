FROM python:3.11-slim

WORKDIR /app/backend

COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY static ./static   # ← ESTA LÍNEA ES LA SOLUCIÓN

EXPOSE 10000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]

