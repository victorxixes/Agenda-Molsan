FROM python:3.11-slim

WORKDIR /app

# Copiar requirements DESDE el contexto actual (que es /backend)
COPY requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Copiar la carpeta app
COPY app ./app

EXPOSE 10000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]

