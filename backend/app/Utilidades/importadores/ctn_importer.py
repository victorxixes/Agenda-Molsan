from openpyxl import load_workbook
from sqlalchemy.orm import Session
from io import BytesIO

from backend.app.ctn.models import Notaria   # ruta correcta

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
    "Dirección": "direccion",
    "VC": "vc",
    "Apoderado": "apoderado",
    "Apoderado S": "apoderado_s",
    "Observación": "observacion",
}

def normalizar_vc(vc: str) -> str:
    if not vc:
        return "Presencial"
    vc = vc.strip().upper()
    if vc == "SI":
        return "VideoConferencia"
    return "Presencial"

def limpiar_texto(v):
    if v is None:
        return ""
    v = str(v).strip()
    if v.lower() == "none":
        return ""
    return v

def importar_ctn_desde_excel(db: Session, contenido: bytes) -> int:
    # ⭐ BORRAR TODO ANTES DE IMPORTAR
    db.query(Notaria).delete()
    db.commit()

    wb = load_workbook(BytesIO(contenido))
    ws = wb.active

    filas = list(ws.iter_rows(values_only=True))

    # Buscar cabecera
    header_row_index = None
    for i, fila in enumerate(filas):
        if fila and "Código" in fila:
            header_row_index = i
            break

    if header_row_index is None:
        raise Exception("No se encontraron cabeceras válidas en el Excel")

    headers = filas[header_row_index]
    data_rows = filas[header_row_index + 1:]

    insertados = 0

    for row in data_rows:
        if not row or all(cell is None for cell in row):
            continue

        datos = {}

        for idx, header in enumerate(headers):
            if header in HEADER_MAP:
                campo = HEADER_MAP[header]
                valor = row[idx] if idx < len(row) else None
                datos[campo] = limpiar_texto(valor)

        # Normalizar VC
        datos["vc"] = normalizar_vc(datos.get("vc"))

        # Normalizar apoderados
        datos["apoderado"] = limpiar_texto(datos.get("apoderado"))
        datos["apoderado_s"] = limpiar_texto(datos.get("apoderado_s"))

        # Normalizar observación
        datos["observacion"] = limpiar_texto(datos.get("observacion"))

        notaria = Notaria(**datos)
        db.add(notaria)
        insertados += 1

    db.commit()
    return insertados
