from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt

from backend.app.config import settings
from backend.app.database import get_db
from backend.app.empleados.models import Empleado


# ============================================================
# OAUTH2
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="api/auth/login"
)


# ============================================================
# OBTENER USUARIO ACTUAL — COMPATIBILIDAD
# ============================================================
#
# Esta función devuelve un DICT.
#
# Se mantiene porque puede estar siendo utilizada por otros
# módulos del ERP.
#
# NO utilizar esta función cuando necesitemos trabajar con
# el objeto SQLAlchemy Empleado completo.
# ============================================================

def obtener_usuario_actual(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:

        # ----------------------------------------------------
        # DECODIFICAR JWT
        # ----------------------------------------------------

        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[
                settings.ALGORITHM
            ]
        )

        empleado_id = payload.get(
            "id"
        )

        if not empleado_id:

            raise HTTPException(
                status_code=401,
                detail="Token inválido"
            )

        # ----------------------------------------------------
        # BUSCAR EMPLEADO
        # ----------------------------------------------------

        empleado = (
            db.query(Empleado)
            .filter(
                Empleado.id == empleado_id
            )
            .first()
        )

        if not empleado:

            raise HTTPException(
                status_code=401,
                detail="Usuario no encontrado"
            )

        # ----------------------------------------------------
        # COMPROBAR ACTIVO
        # ----------------------------------------------------

        if hasattr(
            empleado,
            "activo"
        ):

            if empleado.activo is False:

                raise HTTPException(
                    status_code=401,
                    detail="Usuario inactivo"
                )

        # ----------------------------------------------------
        # NORMALIZAR MÓDULOS
        # ----------------------------------------------------

        modulos = (
            empleado.modulos_visibles_list
            if isinstance(
                empleado.modulos_visibles_list,
                list
            )
            else []
        )

        # ----------------------------------------------------
        # NORMALIZAR PERMISOS
        # ----------------------------------------------------

        permisos = (
            empleado.permisos_modulo_dict
            if isinstance(
                empleado.permisos_modulo_dict,
                dict
            )
            else {}
        )

        # ----------------------------------------------------
        # DEVOLVER DICT
        # ----------------------------------------------------

        return {

            "id": empleado.id,

            "usuario": (
                empleado.usuario
                or ""
            ),

            # ------------------------------------------------
            # ROL
            # ------------------------------------------------
            #
            # El rol solamente identifica al empleado.
            # NO se utiliza aquí para conceder permisos.
            # ------------------------------------------------

            "rol_id": (
                empleado.rol_id
            ),

            "rol_nombre": (
                empleado.rol.nombre
                if empleado.rol
                else None
            ),

            # ------------------------------------------------
            # MÓDULOS
            # ------------------------------------------------

            "modulos_visibles": (
                modulos
            ),

            # ------------------------------------------------
            # PERMISOS
            # ------------------------------------------------

            "permisos_modulo": (
                permisos
            ),
        }

    except HTTPException:
        raise

    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code=401,
            detail="Token expirado"
        )

    except jwt.InvalidTokenError:

        raise HTTPException(
            status_code=401,
            detail="Token inválido"
        )

    except Exception as e:

        print(
            f"ERROR AUTENTICACIÓN: {e}",
            flush=True
        )

        raise HTTPException(
            status_code=401,
            detail="No se pudo validar el usuario"
        )


# ============================================================
# GET CURRENT USER
# ============================================================
#
# Esta es la función que utilizaremos cuando necesitemos
# trabajar con el OBJETO EMPLEADO REAL.
#
# Devuelve:
#
#     Empleado
#
# NO devuelve un dict.
#
# Esto permite acceder directamente a:
#
#     empleado.rol
#     empleado.rol_id
#     empleado.modulos_visibles_list
#     empleado.permisos_modulo_dict
#     empleado.usuario
#     empleado.activo
#
# IMPORTANTE:
#
# El rol NO concede permisos.
#
# Los permisos están exclusivamente en:
#
#     empleado.permisos_modulo_dict
#
# ============================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:

        # ----------------------------------------------------
        # DECODIFICAR JWT
        # ----------------------------------------------------

        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[
                settings.ALGORITHM
            ]
        )

        empleado_id = payload.get(
            "id"
        )

        if not empleado_id:

            raise HTTPException(
                status_code=401,
                detail="Token inválido"
            )

        # ----------------------------------------------------
        # BUSCAR EMPLEADO
        # ----------------------------------------------------

        empleado = (
            db.query(Empleado)
            .filter(
                Empleado.id == empleado_id
            )
            .first()
        )

        if not empleado:

            raise HTTPException(
                status_code=401,
                detail="Usuario no encontrado"
            )

        # ----------------------------------------------------
        # COMPROBAR ACTIVO
        # ----------------------------------------------------

        if hasattr(
            empleado,
            "activo"
        ):

            if empleado.activo is False:

                raise HTTPException(
                    status_code=401,
                    detail="Usuario inactivo"
                )

        # ----------------------------------------------------
        # DEVOLVER OBJETO SQLALCHEMY
        # ----------------------------------------------------

        return empleado

    except HTTPException:
        raise

    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code=401,
            detail="Token expirado"
        )

    except jwt.InvalidTokenError:

        raise HTTPException(
            status_code=401,
            detail="Token inválido"
        )

    except Exception as e:

        print(
            f"ERROR AUTENTICACIÓN: {e}",
            flush=True
        )

        raise HTTPException(
            status_code=401,
            detail="No se pudo validar el usuario"
        )
