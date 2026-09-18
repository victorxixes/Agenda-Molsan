from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.seguridad.auditoria.service import obtener_auditoria_empleado

router = APIRouter(
    prefix="/seguridad",
    tags=["Seguridad - Ficha Completa Empleado"]
)

# ============================================================
# PLANTILLA PERMISOS SJ‑2026 — SIEMPRE visible en ficha empleado
# ============================================================

PLANTILLA_PERMISOS = {
    "ctn": ["ver","crear","editar","eliminar"],
    "logs": ["ver","crear","editar","eliminar"],
    "agenda": ["ver","crear","editar","eliminar"],
    "intranet": ["ver","crear","editar","eliminar"],
    "maestros": ["ver","crear","editar","eliminar"],
    "mensajes": ["ver","crear","editar","eliminar"],
    "noticias": ["ver","crear","editar","eliminar"],
    "realtime": ["ver","crear","editar","eliminar"],
    "auditoria": ["ver","crear","editar","eliminar"],
    "dashboard": ["ver","crear","editar","eliminar"],
    "empleados": ["ver","crear","editar","eliminar"],
    "seguridad": ["ver","crear","editar","eliminar"],
    "documentos": ["ver","crear","editar","eliminar"],
    "utilidades": ["ver","crear","editar","eliminar"],
    "herramientas": ["ver","crear","editar","eliminar"],
    "panel-tecnico": ["ver","crear","editar","eliminar"],
    "notificaciones": ["ver","crear","editar","eliminar"]
}

@router.get("/empleado/{empleado_id}/ficha-completa")
def obtener_ficha_completa(empleado_id: int, db: Session = Depends(get_db)):

    empleado = db.execute("""
        SELECT id, nombre, apellidos, dni, telefono,
               email_personal, email_empresa, extension,
               usuario, direccion, codigo_postal, poblacion, provincia,
               fecha_nacimiento, alergias, persona_contacto, telefono_contacto,
               observaciones, foto,
               departamento_id, seccion_id, cargo_id, rol_id,
               fecha_alta, fecha_baja, activo,
               modulos_visibles_list, permisos_modulo_dict
        FROM empleados
        WHERE id = :id
    """, {"id": empleado_id}).fetchone()

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # Obtener rol
    rol = db.execute("""
        SELECT id, nombre
        FROM roles
        WHERE id = :id
    """, {"id": empleado.rol_id}).fetchone()

    rol_dict = None
    if rol:
        rol_dict = {
            "id": rol.id,
            "nombre": rol.nombre
        }

    # Auditoría
    auditoria = obtener_auditoria_empleado(db, empleado.usuario)

    # ============================================================
    # 🔥 CORRECCIÓN CRÍTICA:
    # SI permisos_modulo_dict está vacío → devolver PLANTILLA_PERMISOS
    # ============================================================

    permisos_finales = empleado.permisos_modulo_dict or PLANTILLA_PERMISOS

    return {
        "empleado": {
            "id": empleado.id,
            "nombre": empleado.nombre,
            "apellidos": empleado.apellidos,
            "dni": empleado.dni,
            "telefono": empleado.telefono,
            "email_personal": empleado.email_personal,
            "email_empresa": empleado.email_empresa,
            "extension": empleado.extension,
            "usuario": empleado.usuario,
            "direccion": empleado.direccion,
            "codigo_postal": empleado.codigo_postal,
            "poblacion": empleado.poblacion,
            "provincia": empleado.provincia,
            "fecha_nacimiento": empleado.fecha_nacimiento,
            "alergias": empleado.alergias,
            "persona_contacto": empleado.persona_contacto,
            "telefono_contacto": empleado.telefono_contacto,
            "observaciones": empleado.observaciones,
            "foto": empleado.foto,
            "departamento_id": empleado.departamento_id,
            "seccion_id": empleado.seccion_id,
            "cargo_id": empleado.cargo_id,
            "rol": rol_dict,
            "fecha_alta": empleado.fecha_alta,
            "fecha_baja": empleado.fecha_baja,
            "activo": empleado.activo
        },
        "modulos_visibles": empleado.modulos_visibles_list or [],
        "permisos_modulo": permisos_finales,
        "auditoria": auditoria
    }
