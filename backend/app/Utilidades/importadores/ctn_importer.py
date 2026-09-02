from io import BytesIO
from openpyxl import load_workbook
from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria


def limpiar(valor):
    if valor is None:
        return ""
    return str(valor).strip()


# Mapeo explícito de cabeceras del Excel → campos del modelo Notaria
HEADER_MAP = {
    "código": "codigo",
    "codigo": "codigo",
    "nombre": "nombre",
    "apellidos": "apellidos",
    "nif": "nif",
    "teléfono": "telefono",
    "telefono": "telefono",
    "departamento cancelaciones": "departamento_cancelaciones",
    "departamento copias": "departamento_copias",
    "otros departamentos": "otros_departamentos",
    "cp": "cp",
    "provincia": "provincia",
    "municipio": "municipio",
    "vc": "vc",
    "apoderado": "apoderado",
    "apoderado s": "apoderado_s",
    "observación": "observacion",
    "observacion": "observacion",
}


def importar_excel_ctn(db: Session, file):
    try:
        contenido = file.file.read()
        wb = load_workbook(filename=BytesIO(contenido), data_only=True)
        ws = wb.active

        # Fila 2 = cabecera real
        raw_headers = [limpiar(c.value) for c in ws[2]]

        # Normalizar cabeceras (lower, sin espacios extra)
        headers = [h.lower().strip() for h in raw_headers if h]

        # Comprobar que al menos tenemos "Código"
        if not any(h in ("código", "codigo") for h in headers):
            return {
                "message": "Error: no se ha encontrado columna 'Código' en la cabecera",
                "total_importadas": 0,
                "columnas_detectadas": raw_headers,
            }

        filas = []
        for row in ws.iter_rows(min_row=3, values_only=True):
            # Si la fila está completamente vacía, la marcamos como vacía luego
            if all(c is None for c in row):
                filas.append({"__fila_vacia__": True})
                continue

            fila = {}
            for i, header in enumerate(headers):
                # Protección ante filas con menos columnas que la cabecera
                valor = row[i] if i < len(row) else None
                fila[header] = limpiar(valor)
            filas.append(fila)

    except Exception as e:
        return {
            "message": f"Error leyendo Excel: {str(e)}",
            "total_importadas": 0
        }

    nuevas = 0
    actualizadas = 0
    duplicados_ignorados = 0
    filas_vacias = 0
    filas_erroneas = 0
    total_importadas = 0

    codigos_vistos = set()

    for fila in filas:
        try:
            # Fila completamente vacía
            if fila.get("__fila_vacia__"):
                filas_vacias += 1
                continue

            # Obtener código con cabeceras normalizadas
            codigo_raw = fila.get("código") or fila.get("codigo") or ""
            codigo = limpiar(codigo_raw)

            if codigo == "":
                filas_vacias += 1
                continue

            # Evitar duplicados dentro del propio Excel
            if codigo in codigos_vistos:
                duplicados_ignorados += 1
                continue

            codigos_vistos.add(codigo)

            # Construir nueva_data usando HEADER_MAP
            nueva_data = {}
            for header, value in fila.items():
                if header in HEADER_MAP:
                    campo_modelo = HEADER_MAP[header]
                    nueva_data[campo_modelo] = limpiar(value)

            # Asegurarnos de que al menos tenemos código
            nueva_data["codigo"] = codigo

            existente = db.query(Notaria).filter(Notaria.codigo == codigo).first()

            if existente:
                for campo, valor in nueva_data.items():
                    setattr(existente, campo, valor)
                actualizadas += 1
            else:
                nueva = Notaria(**nueva_data)
                db.add(nueva)
                nuevas += 1

            total_importadas += 1

        except Exception as e:
            filas_erroneas += 1
            # Log de contexto para futuros errores
            print(f"[CTN IMPORT ERROR] Código={codigo} Fila={fila} Error={e}")
            continue

    db.commit()

    return {
        "message": "Importación CTN completada correctamente",
        "total_importadas": total_importadas,
        "nuevas": nuevas,
        "actualizadas": actualizadas,
        "duplicados_ignorados": duplicados_ignorados,
        "filas_vacias": filas_vacias,
        "filas_erroneas": filas_erroneas,
        "columnas_detectadas": raw_headers
    }
