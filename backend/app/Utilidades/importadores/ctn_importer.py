from openpyxl import load_workbook
from sqlalchemy.orm import Session
from backend.app.ctn.models import Notaria

def limpiar(valor):
    if valor is None:
        return ""
    return str(valor).strip()

def importar_excel_ctn(db: Session, file):
    try:
        contenido = file.file.read()

        # Cargar Excel con openpyxl
        wb = load_workbook(filename=BytesIO(contenido), data_only=True)
        ws = wb.active

        # Fila 1 = título → ignorar
        # Fila 2 = cabecera real
        headers = [limpiar(c.value) for c in ws[2]]

        # Crear lista de diccionarios con filas 3+
        filas = []
        for row in ws.iter_rows(min_row=3, values_only=True):
            fila = {headers[i]: limpiar(row[i]) for i in range(len(headers))}
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
            codigo = limpiar(fila.get("Código")) or limpiar(fila.get("codigo"))

            if codigo == "":
                filas_vacias += 1
                continue

            if codigo in codigos_vistos:
                duplicados_ignorados += 1
                continue

            codigos_vistos.add(codigo)

            existente = db.query(Notaria).filter(Notaria.codigo == codigo).first()

            nueva_data = {
                "codigo": codigo,
                "nombre": limpiar(fila.get("Nombre")),
                "apellidos": limpiar(fila.get("Apellidos")),
                "nif": limpiar(fila.get("NIF")),
                "telefono": limpiar(fila.get("Teléfono")),
                "departamento_cancelaciones": limpiar(fila.get("Departamento cancelaciones")),
                "departamento_copias": limpiar(fila.get("Departamento copias")),
                "otros_departamentos": limpiar(fila.get("Otros departamentos")),
                "cp": limpiar(fila.get("CP")),
                "provincia": limpiar(fila.get("Provincia")),
                "municipio": limpiar(fila.get("Municipio")),
                "vc": limpiar(fila.get("VC")),
                "apoderado": limpiar(fila.get("Apoderado")),
                "apoderado_s": limpiar(fila.get("Apoderado S")),
                "observacion": limpiar(fila.get("Observación")),
            }

            if existente:
                for campo, valor in nueva_data.items():
                    setattr(existente, campo, valor)
                actualizadas += 1
            else:
                nueva = Notaria(**nueva_data)
                db.add(nueva)
                nuevas += 1

            total_importadas += 1

        except Exception:
            filas_erroneas += 1
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
        "columnas_detectadas": headers
    }
