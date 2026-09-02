import pandas as pd
from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria
from backend.app.Utilidades.importadores.normalizador_excel import normalizar_excel


def limpiar(valor):
    if pd.isna(valor):
        return ""
    return str(valor).strip()


def importar_excel_ctn(db: Session, file):
    try:
        # Leer Excel normalizado
        csv_buffer, error = normalizar_excel(file)

        if error:
            return {
                "message": f"No se pudo leer el archivo: {error}",
                "total_importadas": 0
            }

        df = pd.read_csv(csv_buffer)

        # ⭐ IGNORAR FILA 1 (título)
        # ⭐ USAR FILA 2 COMO CABECERA REAL
        df.columns = df.iloc[1]
        df = df.iloc[2:]

        # ⭐ Convertir todo a string para evitar NaN / inf
        df = df.astype(str)

    except Exception as e:
        return {
            "message": f"Error procesando el archivo: {str(e)}",
            "total_importadas": 0
        }

    nuevas = 0
    actualizadas = 0
    duplicados_ignorados = 0
    filas_vacias = 0
    filas_erroneas = 0
    total_importadas = 0

    codigos_vistos = set()

    for _, row in df.iterrows():
        try:
            codigo = limpiar(row.get("Código")) or limpiar(row.get("codigo"))

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
                "nombre": limpiar(row.get("Nombre")),
                "apellidos": limpiar(row.get("Apellidos")),
                "nif": limpiar(row.get("NIF")),
                "telefono": limpiar(row.get("Teléfono")),
                "departamento_cancelaciones": limpiar(row.get("Departamento cancelaciones")),
                "departamento_copias": limpiar(row.get("Departamento copias")),
                "otros_departamentos": limpiar(row.get("Otros departamentos")),
                "cp": limpiar(row.get("CP")),
                "provincia": limpiar(row.get("Provincia")),
                "municipio": limpiar(row.get("Municipio")),
                "vc": limpiar(row.get("VC")),
                "apoderado": limpiar(row.get("Apoderado")),
                "apoderado_s": limpiar(row.get("Apoderado S")),
                "observacion": limpiar(row.get("Observación")),
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
        "total_importadas": int(total_importadas),
        "nuevas": int(nuevas),
        "actualizadas": int(actualizadas),
        "duplicados_ignorados": int(duplicados_ignorados),
        "filas_vacias": int(filas_vacias),
        "filas_erroneas": int(filas_erroneas),
        "columnas_detectadas": list(df.columns)
    }
