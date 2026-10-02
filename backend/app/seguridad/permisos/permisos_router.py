from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.permisos.models import Permiso


router = APIRouter(
    prefix="/seguridad/permisos",
    tags=["Seguridad - Permisos"]
)


# ============================================================
# PERMISOS BASE SJ-2026
# ============================================================
#
# Catálogo único de módulos/permisos disponibles en Molsan ERP.
#
# IMPORTANTE:
# Esta lista debe mantenerse sincronizada con
# PLANTILLA_PERMISOS de:
#
# backend/app/seguridad/router.py
#
# ============================================================

MODULOS_BASE = [
    "ctn",
    "logs",
    "agenda",
    "intranet",
    "maestros",
    "mensajes",
    "noticias",
    "realtime",
    "auditoria",
    "dashboard",
    "empleados",
    "seguridad",
    "documentos",
    "utilidades",
    "herramientas",
    "panel-tecnico",
    "expedientes",
    "notificaciones",
]


PERMISOS_BASE = [
    "ver",
    "crear",
    "editar",
    "eliminar",
]


# ============================================================
# GENERAR CATÁLOGO BASE
# ============================================================

def _catalogo_base():
    """
    Genera todas las combinaciones módulo/permisos.

    Ejemplo:

        {
            "modulo": "expedientes",
            "permiso": "ver"
        }

    """

    return [
        {
            "modulo": modulo,
            "permiso": permiso,
        }
        for modulo in MODULOS_BASE
        for permiso in PERMISOS_BASE
    ]


# ============================================================
# LISTAR PERMISOS
# ============================================================

@router.get("/")
def obtener_permisos(
    db: Session = Depends(get_db)
):
    """
    Devuelve todos los permisos almacenados en BD.

    Si la tabla todavía está vacía, devolvemos el catálogo base
    para que la interfaz de Seguridad pueda funcionar incluso
    antes de ejecutar crear-base.
    """

    permisos = (
        db.query(Permiso)
        .order_by(
            Permiso.modulo.asc(),
            Permiso.permiso.asc()
        )
        .all()
    )

    # --------------------------------------------------------
    # Si existen permisos en BD
    # --------------------------------------------------------

    if permisos:

        return [
            {
                "id": permiso.id,
                "modulo": permiso.modulo,
                "permiso": permiso.permiso,
            }
            for permiso in permisos
            if (
                permiso
                and isinstance(
                    permiso.modulo,
                    str
                )
                and isinstance(
                    permiso.permiso,
                    str
                )
            )
        ]

    # --------------------------------------------------------
    # Si todavía no existen permisos
    # --------------------------------------------------------
    #
    # Devolvemos el catálogo base.
    #
    # id = None porque todavía no existe registro físico.
    # --------------------------------------------------------

    return [
        {
            "id": None,
            "modulo": item["modulo"],
            "permiso": item["permiso"],
        }
        for item in _catalogo_base()
    ]


# ============================================================
# CREAR PERMISOS BASE
# ============================================================

@router.post("/crear-base")
def crear_permisos_base(
    db: Session = Depends(get_db)
):
    """
    Crea todos los permisos base que todavía no existan.

    Es seguro ejecutarlo varias veces.

    No duplica registros.
    """

    creados = []
    existentes = []

    for item in _catalogo_base():

        modulo = item["modulo"]
        permiso = item["permiso"]

        existente = (
            db.query(Permiso)
            .filter(
                Permiso.modulo == modulo,
                Permiso.permiso == permiso,
            )
            .first()
        )

        if existente:

            existentes.append(
                f"{modulo}:{permiso}"
            )

            continue

        nuevo = Permiso(
            modulo=modulo,
            permiso=permiso,
        )

        db.add(nuevo)

        creados.append(
            f"{modulo}:{permiso}"
        )

    db.commit()

    return {
        "estado": "OK",
        "permisos_creados": creados,
        "total_creados": len(creados),
        "total_existentes": len(existentes),
    }
