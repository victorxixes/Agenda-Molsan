from io import BytesIO
import pandas as pd
from sqlalchemy.orm import Session
from backend.app.ctn.models import Notaria

def importar_excel_ctn(db: Session, file):

    # Leer contenido real del archivo
    contenido = file.file.read()
    df = pd.read_excel(BytesIO(contenido), header=1, dtype=str)

    df = df.fillna("")
    df = df.applymap(lambda x: str(x).strip())

    if "Otros departamentos" in df.columns:
        df["Otros departamentos"] = df["Otros departamentos"].str.replace("\n", "; ")

    if "Teléfono" in df.columns:
        df["Teléfono"] = df["Teléfono"].str.replace(".", "")

    if "Código" in df.columns:
        df["Código"] = df["Código"].apply(lambda x: x.zfill(7))

    total_importadas = 0
    nuevas = 0
    actualizadas = 0
    duplicados_ignorados = 0
    filas_vacias = 0
    filas_erroneas = 0

    columnas_detectadas = list(df.columns)

    for _, fila in df.iterrows():

        if all(v == "" for v in fila.values):
            filas_vacias += 1
            continue

        try:
            codigo = fila.get("Código", "")
            nombre = fila.get("Nombre", "")
            apellidos = fila.get("Apellidos", "")
            nif = fila.get("NIF", "")
            telefono = fila.get("Teléfono", "")
            departamento_cancelaciones = fila.get("Departamento cancelaciones", "")
            departamento_copias = fila.get("Departamento copias", "")
            otros_departamentos = fila.get("Otros departamentos", "")
            cp = fila.get("CP", "")
            provincia = fila.get("Provincia", "")
            municipio = fila.get("Municipio", "")
            vc = fila.get("VC", "")
            apoderado = fila.get("Apoderado", "")
            apoderado_s = fila.get("Apoderado S", "")
            observacion = fila.get("Observación", "")

            if codigo == "" or nombre == "":
                filas_erroneas += 1
                continue

            existente = db.query(Notaria).filter(Notaria.codigo == codigo).first()

            if existente:
                existente.nombre = nombre
                existente.apellidos = apellidos
                existente.nif = nif
                existente.telefono = telefono
                existente.departamento_cancelaciones = departamento_cancelaciones
                existente.departamento_copias = departamento_copias
                existente.otros_departamentos = otros_departamentos
                existente.cp = cp
                existente.provincia = provincia
                existente.municipio = municipio
                existente.vc = vc
                existente.apoderado = apoderado
                existente.apoderado_s = apoderado_s
                existente.observacion = observacion

                actualizadas += 1

            else:
                nuevo = Notaria(
                    codigo=codigo,
                    nombre=nombre,
                    apellidos=apellidos,
                    nif=nif,
                    telefono=telefono,
                    departamento_cancelaciones=departamento_cancelaciones,
                    departamento_copias=departamento_copias,
                    otros_departamentos=otros_departamentos,
                    cp=cp,
                    provincia=provincia,
                    municipio=municipio,
                    vc=vc,
                    apoderado=apoderado,
                    apoderado_s=apoderado_s,
                    observacion=observacion
                )
                db.add(nuevo)
                nuevas += 1

            total_importadas += 1

        except Exception as e:
            filas_erroneas += 1
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
        "columnas_detectadas": columnas_detectadas
    }
