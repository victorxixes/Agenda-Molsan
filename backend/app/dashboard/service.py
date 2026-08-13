from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.agenda.models import Cita
from backend.app.empleados.models import Empleado
from backend.app.mensajes.models import Mensaje
from backend.app.logs.models import Log

# ---------------------------------------------------------
# IMPORTAR CTN DE FORMA SEGURA
# ---------------------------------------------------------
try:
    from backend.app.ctn.models import Notaria as Notario, Zona, Firma
    CTN_ENABLED = True
except Exception:
    CTN_ENABLED = False


def resumen_agenda(db: Session, empleado_id: int):
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()

    hoy = date.today()
    inicio_semana = hoy - timedelta(days=hoy.weekday())
    fin_semana = inicio_semana + timedelta(days=6)

    # -------------------------
    # FILTRO SEGÚN ROL
    # -------------------------
    filtro = None
    if hasattr(empleado, "rol") and empleado.rol == "apoderado":
        filtro = (Cita.apoderado_id == empleado_id)

    # -------------------------
    # CITAS DEL DÍA
    # -------------------------
    q_hoy = db.query(Cita).filter(Cita.fecha == hoy)
    if filtro:
        q_hoy = q_hoy.filter(filtro)
    citas_hoy = q_hoy.count()

    # -------------------------
    # CITAS DE LA SEMANA
    # -------------------------
    q_semana = db.query(Cita).filter(
        Cita.fecha >= inicio_semana,
        Cita.fecha <= fin_semana
    )
    if filtro:
        q_semana = q_semana.filter(filtro)
    citas_semana = q_semana.count()

    # -------------------------
    # FIRMAS VC / PRESENCIAL
    # -------------------------
    firmas_vc_hoy = q_hoy.filter(Cita.tipo_firma == "VideoConferencia").count()
    firmas_p_hoy = q_hoy.filter(Cita.tipo_firma == "Presencial").count()

    firmas_vc_semana = q_semana.filter(Cita.tipo_firma == "VideoConferencia").count()
    firmas_p_semana = q_semana.filter(Cita.tipo_firma == "Presencial").count()

    # -------------------------
    # FIRMAS POR MES (AÑO ACTUAL)
    # -------------------------
    año_actual = hoy.year
    firmas_por_mes = {}

    for mes in range(1, 13):
        inicio_mes = date(año_actual, mes, 1)
        fin_mes = date(año_actual, mes, 31)

        q_mes = db.query(Cita).filter(
            Cita.fecha >= inicio_mes,
            Cita.fecha <= fin_mes
        )
        if filtro:
            q_mes = q_mes.filter(filtro)

        firmas_por_mes[mes] = {
            "vc": q_mes.filter(Cita.tipo_firma == "VideoConferencia").count(),
            "p": q_mes.filter(Cita.tipo_firma == "Presencial").count()
        }

    firmas_por_mes_array = [
        {"mes": mes, "vc": valores["vc"], "p": valores["p"]}
        for mes, valores in firmas_por_mes.items()
    ]

    # ======================================================
    # 🔥 DASHBOARD AVANZADO
    # ======================================================

    total_empleados = db.query(Empleado).count()
    empleados_activos = db.query(Empleado).filter(Empleado.activo == True).count()

    mensajes_hoy = db.query(Mensaje).filter(func.date(Mensaje.fecha) == hoy).count()
    mensajes_no_leidos = db.query(Mensaje).filter(
        Mensaje.destinatario_id == empleado_id,
        Mensaje.leido == False
    ).count()

    actividad_hoy = db.query(Log).filter(func.date(Log.fecha) == hoy).count()
    actividad_semana = db.query(Log).filter(
        Log.fecha >= inicio_semana,
        Log.fecha <= fin_semana
    ).count()

    if CTN_ENABLED:
        total_notarios = db.query(Notario).count()
        total_zonas = db.query(Zona).count()
        total_firmas_ctn = db.query(Firma).count()
    else:
        total_notarios = 0
        total_zonas = 0
        total_firmas_ctn = 0

    return {
        "rol": getattr(empleado, "rol", None),

        "agenda": {
            "citas_hoy": citas_hoy,
            "citas_semana": citas_semana,
            "firmas_hoy": {
                "vc": firmas_vc_hoy,
                "p": firmas_p_hoy
            },
            "firmas_semana": {
                "vc": firmas_vc_semana,
                "p": firmas_p_semana
            },
            "firmas_por_mes": firmas_por_mes_array
        },

        "empleados": {
            "total": total_empleados,
            "activos": empleados_activos
        },

        "mensajes": {
            "hoy": mensajes_hoy,
            "no_leidos": mensajes_no_leidos
        },

        "actividad": {
            "hoy": actividad_hoy,
            "semana": actividad_semana
        },

        "ctn": {
            "notarios": total_notarios,
            "zonas": total_zonas,
            "firmas": total_firmas_ctn
        }
    }
