from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.seguridad.roles.models import Rol
from backend.app.seguridad.roles.schemas import (
    RolCreate,
    RolOut,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/seguridad/roles",
    tags=["Seguridad - Roles"],
)


# ============================================================
# ROLES BASE DEL SISTEMA
# ============================================================

ROLES_BASE = [
    {
        "id": 1,
        "nombre": "admin",
        "descripcion": "Administrador del sistema",
    },
    {
        "id": 2,
        "nombre": "empleado",
        "descripcion": "Empleado estándar",
    },
    {
        "id": 3,
        "nombre": "rrhh",
        "descripcion": "Recursos Humanos",
    },
    {
        "id": 4,
        "nombre": "direccion",
        "descripcion": "Dirección",
    },
    {
        "id": 5,
        "nombre": "apoderado",
        "descripcion": "Apoderado",
    },
]


# ============================================================
# CREAR ROLES BASE
# ============================================================

@router.post("/crear-base")
def crear_roles_base(
    db: Session = Depends(get_db),
):
    """
    Crea los roles base del sistema si todavía no existen.

    Es seguro ejecutar este endpoint varias veces:
    no duplica los roles existentes.
    """

    creados = []
    existentes = []

    try:

        for datos in ROLES_BASE:

            # ------------------------------------------------
            # BUSCAR POR ID
            # ------------------------------------------------

            rol = db.get(
                Rol,
                datos["id"],
            )

            if rol:

                existentes.append(
                    rol.nombre
                )

                continue

            # ------------------------------------------------
            # COMPROBAR TAMBIÉN EL NOMBRE
            # ------------------------------------------------

            rol_por_nombre = (
                db.query(Rol)
                .filter(
                    Rol.nombre == datos["nombre"]
                )
                .first()
            )

            if rol_por_nombre:

                existentes.append(
                    rol_por_nombre.nombre
                )

                continue

            # ------------------------------------------------
            # CREAR ROL
            # ------------------------------------------------

            rol = Rol(
                id=datos["id"],
                nombre=datos["nombre"],
                descripcion=datos["descripcion"],
            )

            db.add(rol)

            creados.append(
                datos["nombre"]
            )

        db.commit()

    except Exception:

        db.rollback()

        raise

    return {
        "estado": "OK",
        "roles_creados": creados,
        "roles_existentes": existentes,
        "total_roles": (
            len(creados)
            + len(existentes)
        ),
    }


# ============================================================
# LISTAR ROLES
# ============================================================

@router.get(
    "/",
    response_model=list[RolOut],
)
def listar_roles(
    db: Session = Depends(get_db),
):
    """
    Devuelve todos los roles ordenados por ID.
    """

    return (
        db.query(Rol)
        .order_by(
            Rol.id.asc()
        )
        .all()
    )


# ============================================================
# CREAR ROL
# ============================================================

@router.post(
    "/",
    response_model=RolOut,
)
def crear_rol(
    data: RolCreate,
    db: Session = Depends(get_db),
):
    """
    Crea un nuevo rol.
    """

    nombre = (
        data.nombre.strip()
        if data.nombre
        else ""
    )

    if not nombre:

        raise HTTPException(
            status_code=400,
            detail=(
                "El nombre del rol "
                "es obligatorio."
            ),
        )

    # --------------------------------------------------------
    # COMPROBAR NOMBRE
    # --------------------------------------------------------

    existente = (
        db.query(Rol)
        .filter(
            Rol.nombre == nombre
        )
        .first()
    )

    if existente:

        raise HTTPException(
            status_code=400,
            detail=(
                "El rol ya existe."
            ),
        )

    # --------------------------------------------------------
    # CREAR
    # --------------------------------------------------------

    rol = Rol(
        nombre=nombre,
        descripcion=(
            data.descripcion.strip()
            if data.descripcion
            else None
        ),
    )

    try:

        db.add(rol)

        db.commit()

        db.refresh(rol)

    except Exception:

        db.rollback()

        raise

    return rol


# ============================================================
# EDITAR ROL
# ============================================================

@router.put(
    "/{rol_id}",
    response_model=RolOut,
)
def editar_rol(
    rol_id: int,
    data: RolCreate,
    db: Session = Depends(get_db),
):
    """
    Modifica un rol existente.

    El frontend actualmente envía:
        {
            "nombre": "..."
        }

    La descripción también queda soportada si se envía.
    """

    # --------------------------------------------------------
    # BUSCAR ROL
    # --------------------------------------------------------

    rol = (
        db.query(Rol)
        .filter(
            Rol.id == rol_id
        )
        .first()
    )

    if not rol:

        raise HTTPException(
            status_code=404,
            detail="Rol no encontrado.",
        )

    # --------------------------------------------------------
    # VALIDAR NOMBRE
    # --------------------------------------------------------

    nombre = (
        data.nombre.strip()
        if data.nombre
        else ""
    )

    if not nombre:

        raise HTTPException(
            status_code=400,
            detail=(
                "El nombre del rol "
                "es obligatorio."
            ),
        )

    # --------------------------------------------------------
    # COMPROBAR DUPLICADO
    #
    # Permitimos mantener el mismo nombre del propio rol.
    # --------------------------------------------------------

    existente = (
        db.query(Rol)
        .filter(
            Rol.nombre == nombre,
            Rol.id != rol_id,
        )
        .first()
    )

    if existente:

        raise HTTPException(
            status_code=400,
            detail=(
                "Ya existe otro rol "
                "con ese nombre."
            ),
        )

    # --------------------------------------------------------
    # ACTUALIZAR
    # --------------------------------------------------------

    rol.nombre = nombre

    if data.descripcion is not None:

        rol.descripcion = (
            data.descripcion.strip()
        )

    try:

        db.commit()

        db.refresh(rol)

    except Exception:

        db.rollback()

        raise

    return rol


# ============================================================
# ELIMINAR ROL
# ============================================================

@router.delete(
    "/{rol_id}",
)
def eliminar_rol(
    rol_id: int,
    db: Session = Depends(get_db),
):
    """
    Elimina un rol.

    IMPORTANTE:
    No permite eliminar un rol que tenga empleados
    asignados para evitar problemas de integridad
    referencial en la base de datos.
    """

    # --------------------------------------------------------
    # BUSCAR ROL
    # --------------------------------------------------------

    rol = (
        db.query(Rol)
        .filter(
            Rol.id == rol_id
        )
        .first()
    )

    if not rol:

        raise HTTPException(
            status_code=404,
            detail="Rol no encontrado.",
        )

    # --------------------------------------------------------
    # COMPROBAR EMPLEADOS ASIGNADOS
    # --------------------------------------------------------

    empleados_asignados = (
        db.query(Empleado)
        .filter(
            Empleado.rol_id == rol_id
        )
        .count()
    )

    if empleados_asignados > 0:

        raise HTTPException(
            status_code=400,
            detail=(
                "No se puede eliminar el rol "
                f"'{rol.nombre}' porque tiene "
                f"{empleados_asignados} empleado"
                f"{'s' if empleados_asignados != 1 else ''} "
                "asignado"
                f"{'s' if empleados_asignados != 1 else ''}."
            ),
        )

    # --------------------------------------------------------
    # ELIMINAR
    # --------------------------------------------------------

    nombre = rol.nombre

    try:

        db.delete(rol)

        db.commit()

    except Exception:

        db.rollback()

        raise

    return {
        "estado": "OK",
        "mensaje": "Rol eliminado correctamente.",
        "rol_id": rol_id,
        "nombre": nombre,
    }
