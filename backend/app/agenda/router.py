from backend.app.ctn_notarios.models import Notaria
from backend.app.empleados.models import Empleado

def cita_con_relaciones(db: Session, cita: Cita):
    # Obtener notario
    notario = None
    if cita.notario_id:
        notario = db.query(Notaria).filter(Notaria.id == cita.notario_id).first()

    # Obtener apoderado
    apoderado_obj = None
    if cita.apoderado_id:
        apoderado_obj = db.query(Empleado).filter(Empleado.id == cita.apoderado_id).first()

    # Construir apoderado_s
    apoderado_s = None
    if apoderado_obj:
        apoderado_s = f"{apoderado_obj.nombre} {apoderado_obj.apellidos}".strip()

    # Construir estado
    estado = None
    if cita.vc:
        estado = "Validada" if cita.vc.upper() == "SI" else "Pendiente"

    # Devolver respuesta segura compatible con CitaResponse
    return CitaResponse(
        id=cita.id,
        fecha=cita.fecha,
        hora_inicio=cita.hora_inicio,
        hora_fin=cita.hora_fin,
        tipo_cita=cita.tipo_cita,
        notario=notario,
        apoderado=apoderado_obj,
        apoderado_s=apoderado_s,
        estado=estado,
        notario_id=cita.notario_id,
        apoderado_id=cita.apoderado_id,
        vc=cita.vc,
        observacion=cita.observacion
    )
