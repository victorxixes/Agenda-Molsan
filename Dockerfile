FROM python:3.11

WORKDIR /app

# Copiar backend
COPY backend /app/backend

# Instalar dependencias
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# 🔥 IMPORTANTE: Render inyecta variables automáticamente,
# pero Uvicorn NO las carga si no se ejecuta como proceso principal.
# Por eso usamos "exec" y no CMD directo.
ENV PYTHONUNBUFFERED=1

# Ejecutar FastAPI con uvicorn
ENTRYPOINT ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

