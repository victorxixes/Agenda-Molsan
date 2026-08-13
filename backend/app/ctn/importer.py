import pandas as pd
from io import BytesIO
from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria
from backend.app.ctn.utils.normalizador_excel import normalizar_excel
from backend.app.agenda.models import Cita


def limpiar(valor):
    if pd.isna(valor):
        return ""
    return str(valor).strip()


def importar_excel_ctn(db: Session, file):
    try:
        # Normalizar Excel → CSV interno seguro
        csv_buffer, error = normalizar_excel(file)

        if error:
            return {
                "message": f"No se pudo leer el archivo (formato inválido o corrupto): {error}",
                "total_importadas": 0
            }

        # Leer CSV sin encabezados
        df = pd.read_csv(csv_buffer, header=None)

        # Ignorar primera fila (título)
        df = df.iloc[1:]

        # Usar segunda fila como encabezados reales
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

    # ---------------------------------------------------------
    # INFORME DE IMPORTACIÓN
    # ---------------------------------------------------------
    nuevas = 0
    actualizadas = 0
    duplicados_ignorados = 0
    filas_vacias = 0
    filas_erroneas = 0

    codigos_vistos = set()
    total_importadas = 0

    # ---------------------------------------------------------
    # UPSERT CTN (NO BORRAR NOTARÍAS)
    # ---------------------------------------------------------
    for _, row in df.iterrows():
        codigo = limpiar(row.get("Código"))

        # Fila vacía → ignorar
        if codigo == "":
            filas_vacias += 1
            continue

        # Duplicado dentro del mismo Excel
        if codigo in codigos_vistos:
            duplicados_ignorados += 1
            continue

        codigos_vistos.add(codigo)

        try:
            existente = db.query(Notaria).filter(Notaria.codigo == codigo).first()

            if existente:
                # Actualizar campos
                existente.nombre = limpiar(row.get("Nombre"))
                existente.apellidos = limpiar(row.get("Apellidos"))
                existente.nif = limpiar(row.get("NIF"))
                existente.telefono = limpiar(row.get("Teléfono"))

                existente.departamento_cancelaciones = limpiar(row.get("Departamento cancelaciones"))
                existente.departamento_copias = limpiar(row.get("Departamento copias"))
                existente.otros_departamentos = limpiar(row.get("Otros departamentos"))

                existente.cp = limpiar(row.get("CP"))
                existente.provincia = limpiar(row.get("Provincia"))
                existente.municipio = limpiar(row.get("Municipio"))

                existente.vc = limpiar(row.get("VC"))
                existente.apoderado = limpiar(row.get("Apoderado"))
                existente.apoderado_s = limpiar(row.get("Apoderado S"))
                existente.observacion = limpiar(row.get("Observación"))

                actualizadas += 1

            else:
                # Crear nueva notaría
                nueva = Notaria(
                    codigo=codigo,
                    nombre=limpiar(row.get("Nombre")),
                    apellidos=limpiar(row.get("Apellidos")),
                    nif=limpiar(row.get("NIF")),
                    telefono=limpiar(row.get("Teléfono")),

                    departamento_cancelaciones=limpiar(row.get("Departamento cancelaciones")),
                    departamento_copias=limpiar(row.get("Departamento copias")),
                    otros_departamentos=limpiar(row.get("Otros departamentos")),

                    cp=limpiar(row.get("CP")),
                    provincia=limpiar(row.get("Provincia")),
                    municipio=limpiar(row.get("Municipio")),

                    vc=limpiar(row.get("VC")),
                    apoderado=limpiar(row.get("Apoderado")),
                    apoderado_s=limpiar(row.get("Apoderado S")),
                    observacion=limpiar(row.get("Observación"))
                )

                db.add(nueva)
                nuevas += 1

            total_importadas += 1

        except Exception:
            filas_erroneas += 1
            continue

    db.commit()

    # ---------------------------------------------------------
    # RESPUESTA FINAL CON INFORME DETALLADO
    # ---------------------------------------------------------
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
