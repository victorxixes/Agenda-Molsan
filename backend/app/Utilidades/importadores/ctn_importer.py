from typing import Dict
from openpyxl import load_workbook
from sqlalchemy.orm import Session
from fastapi import UploadFile

from backend.app.ctn.models import Notaria

HEADER_MAP = {
    "Código": "codigo",
    "Nombre": "nombre",
    "Apellidos": "apellidos",
    "NIF": "nif",
    "Teléfono": "telefono",
    "Departamento cancelaciones": "departamento_cancelaciones",
    "Departamento copias": "departamento_copias",
    "Otros departamentos": "otros_departamentos",
    "CP": "cp",
    "Provincia": "provincia",
    "Municipio": "municipio",
    "VC": "vc",
    "Apoderado": "apoderado",
    "Apoderado S": "apoderado_s",
    "Observación": "observacion",
}

def importar_ctn_desde_excel(db: Session, fichero: UploadFile) -> int:
    """
    Importa el Excel CTN tal cual:
    - Ignora la primera fila (título)
    - Usa la segunda fila como cabeceras
    - Inserta cada fila tal cual en la BD
    - No borra nada
    - No transforma nada
    - Máxima seguridad ante errores de formato
    """

    contenido = fichero.file.read()
    wb = load_workbook(filename=None, data=contenido)
    ws = wb.active

    filas = list(ws.iter_rows(values_only=True))
    if len(filas) < 3:
        return 0

    headers = filas[1]
    data_rows = filas[2:]

    insertados = 0

    for row in data_rows:
        if all(cell is None for cell in row):
            continue

        datos: Dict[str, str] = {}

        for idx, header in enumerate(headers):
            if header in HEADER_MAP:
                campo = HEADER_MAP[header]
                valor = row[idx] if idx < len(row) else None
                datos[campo] = None if valor is None else str(valor)

        notaria = Notaria(**datos)
        db.add(notaria)
        insertados += 1

    db.commit()
    return insertados
