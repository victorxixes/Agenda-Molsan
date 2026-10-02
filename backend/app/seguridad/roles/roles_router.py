from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
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
# CREAR ROLES BASE
# ============================================================

@router.post(
    "/crear-base",
    response_model=list[RolOut],
)
def crear_roles_base(
    db: Session = Depends(get_db),
):
    """
    Crea los roles base del sistema si todavía no existen.

    Los roles que ya existen no se duplican.
    """

    roles_base = [
        {
            "nombre": "Administrador",
            "descripcion": "Administrador del sistema.",
        },
        {
            "nombre": "Responsable",
            "descripcion": "Responsable de gestión.",
        },
        {
            "nombre": "Usuario",
            "descripcion": "Usuario estándar del sistema.",
        },
    ]

    resultado = []

    for datos in roles_base:

        rol = (
            db.query(Rol)
            .filter(
                Rol.nombre == datos["nombre"]
            )
            .first()
        )

        if not rol:

            rol = Rol(
                nombre=datos["nombre"],
                descripcion=datos["descripcion"],
            )

            db.add(rol)

        resultado.append(rol)

    try:

        db.commit()

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se pudieron crear los roles base.",
        )

    for rol in resultado:
        db.refresh(rol)

    return resultado


# ============================================================
# LISTAR ROLES
# ============================================================

@router.get(
    "",
    response_model=list[RolOut],
)
def listar_roles(
    db: Session = Depends(get_db),
):
    """
    Devuelve todos los roles disponibles.
    """

    roles = (
        db.query(Rol)
        .order_by(
            Rol.id.asc()
        )
        .all()
    )

    return roles


# ============================================================
# CREAR ROL
# ============================================================

@router.post(
    "",
    response_model=RolOut,
    status_code=status.HTTP_201_CREATED,
)
def crear_rol(
    datos: RolCreate,
    db: Session = Depends(get_db),
):
    """
    Crea un nuevo rol.
    """

    nombre = datos.nombre.strip()

    print(
        f"[ROLES] Intentando crear rol: {nombre!r}",
        flush=True,
    )

    if not nombre:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre del rol es obligatorio.",
        )

    # --------------------------------------------------------
    # COMPROBAR SI EL NOMBRE YA EXISTE
    # --------------------------------------------------------

    rol_existente = (
        db.query(Rol)
        .filter(
            Rol.nombre == nombre
        )
        .first()
    )

    if rol_existente:

        print(
            f"[ROLES] DUPLICADO REAL: "
            f"nombre={nombre!r} "
            f"id={rol_existente.id}",
            flush=True,
        )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un rol con ese nombre.",
        )

    # --------------------------------------------------------
    # CREAR
    # --------------------------------------------------------

    rol = Rol(
        nombre=nombre,
        descripcion=datos.descripcion,
    )

    db.add(rol)

    try:

        db.commit()

    except IntegrityError as exc:

        db.rollback()

        # ----------------------------------------------------
        # MOSTRAR EL ERROR REAL DE POSTGRESQL
        # ----------------------------------------------------

        print(
            "====================================================",
            flush=True,
        )

        print(
            "[ROLES] ERROR DE INTEGRIDAD AL CREAR ROL",
            flush=True,
        )

        print(
            f"[ROLES] NOMBRE: {nombre!r}",
            flush=True,
        )

        print(
            f"[ROLES] ERROR: {exc}",
            flush=True,
        )

        print(
            f"[ROLES] ERROR ORIG: {exc.orig}",
            flush=True,
        )

        print(
            "====================================================",
            flush=True,
        )

        # ----------------------------------------------------
        # SOLO DEVOLVEMOS DUPLICADO SI REALMENTE ES EL NOMBRE
        # ----------------------------------------------------

        error_texto = str(exc.orig).lower()

        if (
            "roles_nombre_key" in error_texto
            or "unique constraint" in error_texto
            and "nombre" in error_texto
        ):

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un rol con ese nombre.",
            )

        # ----------------------------------------------------
        # OTRO ERROR DE INTEGRIDAD
        # ----------------------------------------------------

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Error de integridad al crear el rol. "
                "Revisa los logs del servidor."
            ),
        )

    # --------------------------------------------------------
    # REFRESCAR
    # --------------------------------------------------------

    db.refresh(rol)

    print(
        f"[ROLES] Rol creado correctamente: "
        f"id={rol.id}, nombre={rol.nombre!r}",
        flush=True,
    )

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
    datos: RolCreate,
    db: Session = Depends(get_db),
):
    """
    Actualiza un rol existente.

    El frontend actualmente envía únicamente:
        {
            "nombre": "Nuevo nombre"
        }

    Por eso la descripción existente se conserva cuando
    no se envía una nueva descripción.
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El rol no existe.",
        )

    # --------------------------------------------------------
    # VALIDAR NOMBRE
    # --------------------------------------------------------

    nombre = datos.nombre.strip()

    if not nombre:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre del rol es obligatorio.",
        )

    # --------------------------------------------------------
    # COMPROBAR DUPLICADO
    #
    # No podemos permitir:
    #
    # Rol 1 -> Administrador
    # Rol 2 -> Usuario
    #
    # y convertir Rol 2 en Administrador.
    # --------------------------------------------------------

    otro_rol = (
        db.query(Rol)
        .filter(
            Rol.nombre == nombre,
            Rol.id != rol_id,
        )
        .first()
    )

    if otro_rol:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe otro rol con ese nombre.",
        )

    # --------------------------------------------------------
    # ACTUALIZAR NOMBRE
    # --------------------------------------------------------

    rol.nombre = nombre

    # --------------------------------------------------------
    # DESCRIPCIÓN
    #
    # El frontend actual no la envía.
    #
    # Por tanto:
    #
    # datos.descripcion is None
    #
    # significa "conservar la actual".
    # --------------------------------------------------------

    if datos.descripcion is not None:

        rol.descripcion = datos.descripcion

    # --------------------------------------------------------
    # GUARDAR
    # --------------------------------------------------------

    try:

        db.commit()

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se pudo actualizar el rol porque el nombre ya existe.",
        )

    db.refresh(rol)

    return rol


# ============================================================
# ELIMINAR ROL
# ============================================================

@router.delete(
    "/{rol_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_rol(
    rol_id: int,
    db: Session = Depends(get_db),
):
    """
    Elimina un rol.

    IMPORTANTE:
    No se permite eliminar un rol que todavía esté asignado
    a empleados.

    Primero habrá que reasignar esos empleados a otro rol.
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El rol no existe.",
        )

    # --------------------------------------------------------
    # COMPROBAR EMPLEADOS ASIGNADOS
    #
    # El modelo Rol ya tiene:
    #
    # empleados = relationship(
    #     "Empleado",
    #     back_populates="rol"
    # )
    #
    # Por tanto podemos utilizar directamente la relación.
    # --------------------------------------------------------

    if rol.empleados:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "No se puede eliminar el rol porque "
                "está asignado a uno o varios empleados."
            ),
        )

    # --------------------------------------------------------
    # ELIMINAR
    # --------------------------------------------------------

    db.delete(rol)

    try:

        db.commit()

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "No se puede eliminar el rol porque "
                "está siendo utilizado."
            ),
        )

    return None
