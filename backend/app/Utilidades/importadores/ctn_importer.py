from io import BytesIO
import pandas as pd
from sqlalchemy.orm import Session
from backend.app.ctn.models import Notaria

# -----------------------------
# LIMPIEZA DE VALORES
# -----------------------------
def limpiar_valor(x):
    if x is None:
        return ""
    x = str(x).strip()
    if x.lower() in ["nan", "none", "null"]:
        return ""
    return x

# -----------------------------
# IMPORTADOR CTN FINAL
# -----------------------------
def importar_excel_ctn(db: Session, file):

    contenido = file.file.read()

    # Leer Excel con encabezados en fila 2 (header=1)
    try:
        df = pd.read_excel(BytesIO(contenido), header=1, dtype=str)
    except Exception as e:
        return {
            "message": "ERROR leyendo el Excel",
            "error": str(e),
            "total_importadas": 0
        }

    # Ignorar la fila 1 (título)
    df = df.iloc[1:].reset_index(drop=True)

    # Limpieza global
    df = df.fillna("")
    df = df.applymap(limpiar_valor)

    # Normalizaciones
    if "Otros departamentos" in df.columns:
        df["Otros departamentos"] = df["Otros departamentos"].str.replace("\n", "; ")

    if "Teléfono" in df.columns:
        df["Teléfono"] = df["Teléfono"].str.replace(".", "")

    if "Código" in df.columns:
        df["Código"] = df["Código"].apply(
            lambda x: limpiar_valor(x).replace(".", "").replace(",", "").zfill(7)
        )

    # Contadores
    total_importadas = 0
    nuevas = 0
    actualizadas = 0
    duplicados_ignorados = 0
    filas_vacias = 0
    filas_erroneas = 0

    columnas_detectadas = list(df.columns)

    # Procesar filas
    for _, fila in df.iterrows():

        # Fila completamente vacía
        if all(v == "" for v in fila.values):
            filas_vacias += 1
            continue

        try:
            codigo = limpiar_valor(fila.get("Código", ""))
            nombre = limpiar_valor(fila.get("Nombre", ""))

            # Validación mínima
            if not codigo or not nombre:
                filas_erroneas += 1
                continue

            apellidos = limpiar_valor(fila.get("Apellidos", ""))
            nif = limpiar_valor(fila.get("NIF", ""))
            telefono = limpiar_valor(fila.get("Teléfono", ""))
            departamento_cancelaciones = limpiar_valor(fila.get("Departamento cancelaciones", ""))
            departamento_copias = limpiar_valor(fila.get("Departamento copias", ""))
            otros_departamentos = limpiar_valor(fila.get("Otros departamentos", ""))
            cp = limpiar_valor(fila.get("CP", ""))
            provincia = limpiar_valor(fila.get("Provincia", ""))
            municipio = limpiar_valor(fila.get("Municipio", ""))
            vc = limpiar_valor(fila.get("VC", ""))
            apoderado = limpiar_valor(fila.get("Apoderado", ""))
            apoderado_s = limpiar_valor(fila.get("Apoderado S", ""))
            observacion = limpiar_valor(fila.get("Observación", ""))

            existente = db.query(Notaria).filter(Notaria.codigo == codigo).first()

            if existente:
                # Actualizar
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
                # Insertar nueva
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
            print(f"[CTN IMPORT ERROR] Código={codigo} Error={e}")
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
