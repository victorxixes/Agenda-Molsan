FROM python:3.11
FROM python:3.11

WORKDIR /app

COPY backend/app /app/backend/app
COPY backend/requirements.txt /app/backend/requirements.txt

RUN pip install --no-cache-dir -r /app/backend/requirements.txt

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT"]
