FROM python:3.11-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar requirements desde el contexto backend/
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar la carpeta app completa
COPY app ./app

# Exponer el puerto
EXPOSE 10000

# Ejecutar FastAPI con Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]
