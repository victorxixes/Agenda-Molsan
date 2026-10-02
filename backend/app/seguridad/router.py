from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.empleados.models import Empleado
from backend.app.maestros.models import Departamento, Seccion, Cargo


router = APIRouter(
    prefix="/seguridad",
    tags=["Seguridad"]
)


# ============================================================
# DATABASE
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ============================================================
# PLANTILLA PERMISOS SJ-2026
#
# Esta plantilla representa TODOS los módulos/permisos
# disponibles en el sistema.
#
# Se utiliza cuando un empleado todavía no tiene permisos
# personalizados almacenados.
# ============================================================

PLANTILLA_PERMISOS = {
    "ctn": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "logs": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "agenda": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "intranet": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "maestros": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "mensajes": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "noticias": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "realtime": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "auditoria": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "dashboard": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "empleados": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "seguridad": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "documentos": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "utilidades": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "herramientas": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "panel-tecnico": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "expedientes": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],

    "notificaciones": [
        "ver",
        "crear",
        "editar",
        "eliminar",
    ],
}


# ============================================================
# HELPERS
# ============================================================

def _lista_strings(valor):
    """
    Devuelve únicamente strings válidos.
    Evita que JSONB corruptos o valores inesperados
    lleguen al frontend.
    """

    if not isinstance(valor, list):
        return []

    return [
        str(item)
        for item in valor
        if isinstance(item, str)
    ]


def _permisos_dict(valor):
    """
    Normaliza permisos_modulo_dict.

    Esperamos:

    {
        "expedientes": [
            "ver",
            "crear"
        ]
    }
    """

    if not isinstance(valor, dict):
        return {}

    resultado = {}

    for modulo, permisos in valor.items():

        if not isinstance(modulo, str):
            continue

        resultado[modulo] = _lista_strings(
            permisos
        )

    return resultado


def _nombre_relacion(objeto):
    """
    Obtiene de forma segura el nombre de una relación
    de maestros.

    Actualmente los modelos utilizan normalmente
    el campo 'nombre'.
    """

    if objeto is None:
        return ""

    nombre = getattr(
        objeto,
        "nombre",
        ""
    )

    if nombre is None:
        return ""

    return str(nombre)


# ============================================================
# FICHA COMPLETA DEL EMPLEADO
# ============================================================

@router.get(
    "/empleado/{empleado_id}/ficha-completa"
)
def ficha_completa(
    empleado_id: int,
    db: Session = Depends(get_db)
):
    """
    Devuelve toda la información necesaria para la ficha
    de seguridad de un empleado.

    IMPORTANTE:
    El contrato JSON está normalizado para que el frontend
    siempre reciba la misma estructura.
    """

    # --------------------------------------------------------
    # BUSCAR EMPLEADO
    # --------------------------------------------------------

    empleado = (
        db.query(Empleado)
        .filter(
            Empleado.id == empleado_id
        )
        .first()
    )

    if not empleado:

        raise HTTPException(
            status_code=404,
            detail="Empleado no encontrado"
        )

    # --------------------------------------------------------
    # RELACIONES MAESTROS
    # --------------------------------------------------------

    departamento = None
    seccion = None
    cargo = None

    if empleado.departamento_id:

        departamento = (
            db.query(Departamento)
            .filter(
                Departamento.id
                == empleado.departamento_id
            )
            .first()
        )

    if empleado.seccion_id:

        seccion = (
            db.query(Seccion)
            .filter(
                Seccion.id
                == empleado.seccion_id
            )
            .first()
        )

    if empleado.cargo_id:

        cargo = (
            db.query(Cargo)
            .filter(
                Cargo.id
                == empleado.cargo_id
            )
            .first()
        )

    # --------------------------------------------------------
    # MÓDULOS VISIBLES
    # --------------------------------------------------------

    modulos_visibles = _lista_strings(
        empleado.modulos_visibles_list
    )

    # --------------------------------------------------------
    # PERMISOS PERSONALIZADOS
    # --------------------------------------------------------

    permisos_personalizados = _permisos_dict(
        empleado.permisos_modulo_dict
    )

    # --------------------------------------------------------
    # PERMISOS FINALES
    #
    # Si el empleado no tiene ningún permiso configurado,
    # mostramos la plantilla completa.
    #
    # IMPORTANTE:
    # No modificamos el valor almacenado en la base de datos.
    # Solo construimos la respuesta.
    # --------------------------------------------------------

    if permisos_personalizados:

        permisos_finales = (
            permisos_personalizados
        )

    else:

        permisos_finales = {
            modulo: list(permisos)
            for modulo, permisos
            in PLANTILLA_PERMISOS.items()
        }

    # --------------------------------------------------------
    # ROL
    # --------------------------------------------------------

    rol_id = empleado.rol_id

    rol_nombre = ""

    if empleado.rol:

        rol_nombre = getattr(
            empleado.rol,
            "nombre",
            ""
        ) or ""

        rol_nombre = str(
            rol_nombre
        )

    # --------------------------------------------------------
    # EMPLEADO NORMALIZADO
    # --------------------------------------------------------

    empleado_data = {

        "id": empleado.id,

        "nombre": (
            empleado.nombre
            or ""
        ),

        "apellidos": (
            empleado.apellidos
            or ""
        ),

        "dni": (
            empleado.dni
            or ""
        ),

        "telefono": (
            empleado.telefono
            or ""
        ),

        "email_empresa": (
            empleado.email_empresa
            or ""
        ),

        "extension": (
            empleado.extension
            or ""
        ),

        "usuario": (
            empleado.usuario
            or ""
        ),

        "activo": bool(
            empleado.activo
        ),

        "foto": (
            empleado.foto
            if isinstance(
                empleado.foto,
                str
            )
            else None
        ),

        "rol_id": rol_id,

        "rol_nombre": rol_nombre,

        "departamento_id": (
            empleado.departamento_id
        ),

        "departamento_nombre": (
            _nombre_relacion(
                departamento
            )
        ),

        "seccion_id": (
            empleado.seccion_id
        ),

        "seccion_nombre": (
            _nombre_relacion(
                seccion
            )
        ),

        "cargo_id": (
            empleado.cargo_id
        ),

        "cargo_nombre": (
            _nombre_relacion(
                cargo
            )
        ),

        "modulos_visibles_list": (
            modulos_visibles
        ),
    }

    # --------------------------------------------------------
    # AUDITORÍA
    #
    # De momento permanece vacía porque todavía no tenemos
    # conectada la tabla/sistema real de auditoría.
    #
    # NO inventamos datos.
    # --------------------------------------------------------

    auditoria = []

    # --------------------------------------------------------
    # RESPUESTA
    # --------------------------------------------------------

    return {

        "empleado": empleado_data,

        # Alias útil para otros consumidores.
        "modulos_visibles": (
            modulos_visibles
        ),

        # NOMBRE OFICIAL QUE UTILIZARÁ REACT.
        "permisos_modulo_dict": (
            permisos_finales
        ),

        "departamento": (
            {
                "id": departamento.id,
                "nombre": _nombre_relacion(
                    departamento
                ),
            }
            if departamento
            else None
        ),

        "seccion": (
            {
                "id": seccion.id,
                "nombre": _nombre_relacion(
                    seccion
                ),
            }
            if seccion
            else None
        ),

        "cargo": (
            {
                "id": cargo.id,
                "nombre": _nombre_relacion(
                    cargo
                ),
            }
            if cargo
            else None
        ),

        "auditoria": auditoria,
    }
