import pandas as pd
from io import BytesIO
from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria
from backend.app.empleados.models import Empleado
from backend.app.ctn.utils.normalizador_excel import normalizar_excel, normalizar_columnas


def limpiar(valor):
    if pd.isna(valor):
        return ""
    return str(valor).strip()


def normalizar_vc(vc_raw: str):
    vc = vc_raw.strip().upper()

    if vc in ["SI", "SÍ", "VIDEO", "VC", "VIDEOCONFERENCIA"]:
        return "SI"

    if vc in ["NO", "PRESENCIAL"]:
        return "NO"

    return ""


def buscar_apoderado(db: Session, nombre_raw: str, nombre_s_raw: str):
    nombre = limpiar(nombre_raw)
    nombre_s = limpiar(nombre_s_raw)

    if not nombre and not nombre_s:
        return None

    emp = db.query(Empleado).filter(
        (Empleado.nombre + " " + Empleado.apellidos).ilike(f"%{nombre}%")
    ).first()
    if emp:
        return emp.id

    emp = db.query(Empleado).filter(
        (Empleado.nombre + " " + Empleado.apellidos).ilike(f"%{nombre_s}%")
    ).first()
    if emp:
        return emp.id

    emp = db.query(Empleado).filter(
        Empleado.nombre.ilike(f"%{nombre}%")
    ).first()
    if emp:
        return emp.id

    return None


def importar_excel_ctn(db: Session, file):
    try:
        csv_buffer, error = normalizar_excel(file)

        if error:
            return {
                "message": f"No se pudo leer el archivo: {error}",
                "total_importadas": 0
            }

        df = pd.read_csv(csv_buffer)
   
# --- FIX: detectar la fila donde empieza la tabla ---
# La fila 1 es basura, la fila 2 es la cabecera real
# Buscamos la fila donde aparece "Código"
fila_header = None
for i, row in df.iterrows():
    if "Código" in row.values or "codigo" in row.values:
        fila_header = i
        break

if fila_header is None:
    return {
        "message": "No se encontró la cabecera de la tabla (no aparece 'Código')",
        "columnas_detectadas": list(df.columns),
        "total_importadas": 0
    }

# Reprocesar el dataframe usando esa fila como cabecera real
df.columns = df.iloc[fila_header]
df = df[fila_header + 1:]

# Normalizar columnas
df = normalizar_columnas(df)
     
    except Exception as e:
        return {
            "message": f"Error leyendo el archivo: {str(e)}",
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

            nombre = limpiar(row.get("nombre"))
            apellidos = limpiar(row.get("apellidos"))
            vc_raw = limpiar(row.get("vc"))
            observacion_raw = limpiar(row.get("observacion"))
            apoderado_raw = limpiar(row.get("apoderado"))
            apoderado_s_raw = limpiar(row.get("apoderado_s"))

            vc_normalizado = normalizar_vc(vc_raw)
            apoderado_id = buscar_apoderado(db, apoderado_raw, apoderado_s_raw)

            if existente:
                existente.nombre = nombre
                existente.apellidos = apellidos
                existente.nif = limpiar(row.get("nif"))
                existente.telefono = limpiar(row.get("telefono"))

                existente.departamento_cancelaciones = limpiar(row.get("departamento_cancelaciones"))
                existente.departamento_copias = limpiar(row.get("departamento_copias"))
                existente.otros_departamentos = limpiar(row.get("otros_departamentos"))

                existente.cp = limpiar(row.get("cp"))
                existente.provincia = limpiar(row.get("provincia"))
                existente.municipio = limpiar(row.get("municipio"))

                existente.vc = vc_normalizado
                existente.observacion = observacion_raw or None

                existente.apoderado = apoderado_raw
                existente.apoderado_s = apoderado_s_raw
                existente.apoderado_id = apoderado_id

                actualizadas += 1

            else:
                nueva = Notaria(
                    codigo=codigo,
                    nombre=nombre,
                    apellidos=apellidos,
                    nif=limpiar(row.get("nif")),
                    telefono=limpiar(row.get("telefono")),

                    departamento_cancelaciones=limpiar(row.get("departamento_cancelaciones")),
                    departamento_copias=limpiar(row.get("departamento_copias")),
                    otros_departamentos=limpiar(row.get("otros_departamentos")),

                    cp=limpiar(row.get("cp")),
                    provincia=limpiar(row.get("provincia")),
                    municipio=limpiar(row.get("municipio")),

                    vc=vc_normalizado,
                    observacion=observacion_raw or None,

                    apoderado=apoderado_raw,
                    apoderado_s=apoderado_s_raw,
                    apoderado_id=apoderado_id
                )

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
