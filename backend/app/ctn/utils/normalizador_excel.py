import pandas as pd
from io import BytesIO, StringIO

def normalizar_excel(file):
    try:
        # Leer el archivo en memoria
        contenido = file.file.read()
        buffer = BytesIO(contenido)

        # Primer intento con openpyxl
        df = pd.read_excel(buffer, engine="openpyxl", dtype=str)

    except Exception:
        try:
            # IMPORTANTE: volver a posicionar el buffer al inicio
            buffer.seek(0)

            # Segundo intento con xlrd (más tolerante)
            df = pd.read_excel(buffer, engine="xlrd", dtype=str)
        except Exception:
            return None, "Archivo corrupto o formato no soportado"

    # Convertir a CSV interno (siempre seguro)
    csv_buffer = StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)

    return csv_buffer, None
