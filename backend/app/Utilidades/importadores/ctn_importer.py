import pandas as pd
from io import BytesIO
from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria
from backend.app.empleados.models import Empleado
from backend.app.ctn.utils.normalizador_excel import normalizar_excel


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

    return ""   # Valor no válido → vacío


def buscar_apoderado(db: Session, nombre_raw: str, nombre_s_raw: str):
    """
    Busca un apoderado en empleados_v2 usando:
    - Apoderado (texto principal)
    - Apoderado S (texto secundario)
    """

    nombre = limpiar(nombre_raw)
    nombre_s = limpiar(nombre_s_raw)

    if not nombre and not nombre_s:
        return None

    # Intento 1: buscar por nombre completo exacto
    emp = db.query(Empleado).filter(
        (Empleado.nombre + " " + Empleado.apellidos).ilike(f"%{nombre}%")
    ).first()

    if emp:
        return emp.id

    # Intento 2: buscar por apoderado_s
    emp = db.query(Empleado).filter(
        (Empleado.nombre + " " + Empleado.apellidos).ilike(f"%{nombre_s}%")
    ).first()

    if emp:
        return emp.id

    # Intento 3: buscar por coincidencia parcial
    emp = db.query(Empleado).filter(
        Empleado.nombre.ilike(f"%{nombre}%")
    ).first()

    if emp:
        return emp.id

    return None  # No encontrado


def importar_excel_ctn(db: Session, file):
    try:
        csv_buffer, error = normalizar_excel(file)

        if error:
            return {
                "message": f"No se pudo leer el archivo (formato inválido o corrupto): {error}",
                "total_importadas": 0
            }

        df = pd.read_csv(csv_buffer, header=None)
        df = df.iloc[1:]
        df.columns = df.iloc[0]
        df = df[1:]

    except Exception as e:
        return {
            "message": f"No se pudo leer el archivo (formato inválido o corrupto): {str(e)}",
            "total_importadas": 0
        }

    if df.empty:
        return {
            "message": "Excel vacío",
            "total_importadas": 0
        }

    nuevas = 0
    actualizadas = 0
    duplicados_ignorados = 0
    filas_vacias = 0
    filas_erroneas = 0

    codigos_vistos = set()
    total_importadas = 0

    for _, row in df.iterrows():
        codigo = limpiar(row.get("Código"))

        if codigo == "":
            filas_vacias += 1
            continue

        if codigo in codigos_vistos:
            duplicados_ignorados += 1
            continue

        codigos_vistos.add(codigo)

        try:
            existente = db.query(Notaria).filter(Notaria.codigo == codigo).first()

            # Normalizar campos
            nombre = limpiar(row.get("Nombre"))
            apellidos = limpiar(row.get("Apellidos"))
            vc_raw = limpiar(row.get("VC"))
            observacion_raw = limpiar(row.get("Observación"))
            apoderado_raw = limpiar(row.get("Apoderado"))
            apoderado_s_raw = limpiar(row.get("Apoderado S"))

            vc_normalizado = normalizar_vc(vc_raw)
            apoderado_id = buscar_apoderado(db, apoderado_raw, apoderado_s_raw)

            if existente:
                existente.nombre = nombre
                existente.apellidos = apellidos
                existente.nif = limpiar(row.get("NIF"))
                existente.telefono = limpiar(row.get("Teléfono"))

                existente.departamento_cancelaciones = limpiar(row.get("Departamento cancelaciones"))
                existente.departamento_copias = limpiar(row.get("Departamento copias"))
                existente.otros_departamentos = limpiar(row.get("Otros departamentos"))

                existente.cp = limpiar(row.get("CP"))
                existente.provincia = limpiar(row.get("Provincia"))
                existente.municipio = limpiar(row.get("Municipio"))

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
                    nif=limpiar(row.get("NIF")),
                    telefono=limpiar(row.get("Teléfono")),

                    departamento_cancelaciones=limpiar(row.get("Departamento cancelaciones")),
                    departamento_copias=limpiar(row.get("Departamento copias")),
                    otros_departamentos=limpiar(row.get("Otros departamentos")),

                    cp=limpiar(row.get("CP")),
                    provincia=limpiar(row.get("Provincia")),
                    municipio=limpiar(row.get("Municipio")),

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
