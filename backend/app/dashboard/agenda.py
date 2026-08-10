@router.get("/dashboard/agenda")
def dashboard_agenda(db: Session = Depends(get_db)):
    hoy = date.today()

    citas_hoy = db.query(Cita).filter(Cita.fecha == hoy).count()
    citas_pendientes = db.query(Cita).filter(Cita.estado == "pendiente").count()

    firmas_hechas = db.query(Cita).filter(Cita.estado == "hecha").count()
    firmas_pendientes = db.query(Cita).filter(Cita.estado == "pendiente").count()

    presenciales_hechas = db.query(Cita).filter(Cita.tipo_firma == "P", Cita.estado == "hecha").count()
    presenciales_pendientes = db.query(Cita).filter(Cita.tipo_firma == "P", Cita.estado == "pendiente").count()

    vc_hechas = db.query(Cita).filter(Cita.tipo_firma == "VC", Cita.estado == "hecha").count()
    vc_pendientes = db.query(Cita).filter(Cita.tipo_firma == "VC", Cita.estado == "pendiente").count()

    citas_por_provincia = (
        db.query(Cita.provincia, func.count())
        .group_by(Cita.provincia)
        .all()
    )

    citas_por_hora = (
        db.query(Cita.hora_inicio, func.count())
        .group_by(Cita.hora_inicio)
        .all()
    )

    return {
        "citasHoy": citas_hoy,
        "citasPendientes": citas_pendientes,
        "firmasHechas": firmas_hechas,
        "firmasPendientes": firmas_pendientes,
        "presencialesHechas": presenciales_hechas,
        "presencialesPendientes": presenciales_pendientes,
        "vcHechas": vc_hechas,
        "vcPendientes": vc_pendientes,
        "citasPorProvincia": [
            {"provincia": p, "total": t} for p, t in citas_por_provincia
        ],
        "citasPorHora": [
            {"hora": h.strftime("%H:%M"), "total": t} for h, t in citas_por_hora
        ]
    }
