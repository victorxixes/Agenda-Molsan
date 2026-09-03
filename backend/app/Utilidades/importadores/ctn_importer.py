from typing import List, Dict
from openpyxl import load_workbook
from fastapi import UploadFile

def leer_ctn_excel(file: UploadFile) -> List[Dict[str, str]]:
    """
    Lee el Excel de CTN y devuelve una lista de dicts
    con las columnas tal y como están en el fichero.
    - Ignora la primera fila (título)
    - Usa la segunda fila como cabeceras
    - Devuelve cada fila de datos como dict
    """

    # Cargar el libro desde el UploadFile
    contents = file.file.read()
    wb = load_workbook(filename=None, data=contents)
    ws = wb.active

    filas = list(ws.iter_rows(values_only=True))

    if len(filas) < 3:
        return []

    # Fila 1: título (ignorar)
    # Fila 2: cabeceras
    headers = filas[1]

    # Fila 3+: datos
    data_rows = filas[2:]

    resultados: List[Dict[str, str]] = []

    for row in data_rows:
        if all(cell is None for cell in row):
            # Fila completamente vacía → ignorar
            continue

        item: Dict[str, str] = {}
        for idx, header in enumerate(headers):
            if header is None:
                continue
            valor = row[idx] if idx < len(row) else None
            # Convertimos todo a string tal cual, sin transformar
            item[str(header)] = "" if valor is None else str(valor)
        resultados.append(item)

    return resultados
