from openpyxl import load_workbook
from sqlalchemy.orm import Session
from io import BytesIO

def importar_ctn_desde_excel(db: Session, contenido: bytes) -> int:
    """
    Importación blindada:
    - Lee el Excel desde bytes
    - No depende de UploadFile
    - No depende de fichero.file
    - No falla si el archivo llega vacío
    - No falla si el archivo llega como bytes
    - No falla si el archivo llega desde Swagger
    """

    if not contenido or len(contenido) < 10:
        return 0  # archivo vacío o corrupto

    try:
        wb = load_workbook(BytesIO(contenido))
    except Exception:
        return 0  # archivo no válido

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

        datos = {}

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
