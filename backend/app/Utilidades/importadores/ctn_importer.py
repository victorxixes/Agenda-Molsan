import pandas as pd
from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria
from backend.app.Utilidades.importadores.normalizador_excel import normalizar_excel, normalizar_columnas

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

        # --- IGNORAR FILA 1 (título) ---
        # --- USAR FILA 2 COMO CABECERA REAL ---
        df.columns = df.iloc[1]      # fila 2 = cabecera
        df = df.iloc[2:]             # filas 3+ = datos

        # Normalizar nombres de columnas
        df = normalizar_columnas(df)

    except Exception as e:
        return {
            "message": f"Error procesando el archivo: {str(e)}",
            "total_importadas": 0
        }

    if df.empty:
        return {"message": "Excel vacío", "total_importadas": 0}

    nuevas = 0
    actualizadas = 0
    duplicados_ignorados = 0
    filas_vacias = 0
    filas_erroneas = 0

    codigos_vistos = set()
    total_importadas = 0

    for _, row in df.iterrows():
        codigo = limpiar(row.get("codigo"))

        if codigo == "":
            filas_vacias += 1
            continue

        if codigo in codigos_vistos:
            duplicados_ignorados += 1
            continue

        codigos_vistos.add(codigo)

        try:
            existente = db.query(Notaria).filter(Notaria.codigo == codigo).first()

            nueva_data = {
                "codigo": codigo,
                "nombre": limpiar(row.get("nombre")),
                "apellidos": limpiar(row.get("apellidos")),
                "nif": limpiar(row.get("nif")),
                "telefono": limpiar(row.get("telefono")),
                "departamento_cancelaciones": limpiar(row.get("departamento_cancelaciones")),
                "departamento_copias": limpiar(row.get("departamento_copias")),
                "otros_departamentos": limpiar(row.get("otros_departamentos")),
                "cp": limpiar(row.get("cp")),
                "provincia": limpiar(row.get("provincia")),
                "municipio": limpiar(row.get("municipio")),
                "vc": limpiar(row.get("vc")),
                "apoderado": limpiar(row.get("apoderado")),
                "apoderado_s": limpiar(row.get("apoderado_s")),
                "observacion": limpiar(row.get("observacion")),
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
        "columnas_detectadas": list(df.columns)
    }
