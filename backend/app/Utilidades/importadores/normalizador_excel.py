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
            # Reiniciar puntero
            buffer.seek(0)

            # Segundo intento con xlrd
            df = pd.read_excel(buffer, engine="xlrd", dtype=str)
        except Exception:
            return None, "Archivo corrupto o formato no soportado"

    # Convertir a CSV interno
    csv_buffer = StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)

    return csv_buffer, None


def normalizar_columnas(df):
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace("á", "a")
        .str.replace("é", "e")
        .str.replace("í", "i")
        .str.replace("ó", "o")
        .str.replace("ú", "u")
    )
    return df
