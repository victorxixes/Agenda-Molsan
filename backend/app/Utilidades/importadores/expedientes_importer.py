import pandas as pd
from sqlalchemy.orm import Session
from backend.app.expedientes.clientes.models import Cliente
from backend.app.expedientes.models import Expediente
from backend.app.expedientes.fincas.models import ExpedienteFinca
from backend.app.expedientes.provisiones.models import ExpedienteProvision
from backend.app.expedientes.gestoria.models import ExpedienteGestoria
from backend.app.expedientes.defectos.models import ExpedienteDefecto


def importar_excel_expedientes(db: Session, contenido_excel: bytes):
    df = pd.read_excel(contenido_excel)

    creados = 0
    actualizados = 0

    for _, row in df.iterrows():

        # ============================
        # 1) CAMPOS BASE
        # ============================
        idexp = str(row.get("IDEXPEDIENTE")).strip() if row.get("IDEXPEDIENTE") else None
        if not idexp:
            continue

        # ============================
        # 2) CLIENTE
        # ============================
        nif_sol = str(row.get("NIFSOLICITANTE")).strip() if row.get("NIFSOLICITANTE") else None
        nombre_sol = str(row.get("NOMBRESOLICITANTE")).strip() if row.get("NOMBRESOLICITANTE") else ""

        cliente = None
        if nif_sol:
            cliente = db.query(Cliente).filter(Cliente.dni == nif_sol).first()
            if not cliente:
                cliente = Cliente(
                    dni=nif_sol,
                    nombre=nombre_sol,
                )
                db.add(cliente)
                db.flush()

        # ============================
        # 3) EXPEDIENTE
        # ============================
        exp = db.query(Expediente).filter(Expediente.id_expediente == idexp).first()

        if not exp:
            exp = Expediente(
                id_expediente=idexp,
                cliente_id=cliente.id if cliente else None,

                estado_expediente=row.get("ESTADOEXPEDIENTE"),
                fecha_alta=row.get("FECHAALTA"),
                origen_bankia=row.get("ORIGENBANKIA"),
                observaciones=row.get("OBSERVACIONES"),
                dt=row.get("DT"),
                producto_gtg=row.get("PRODUCTOGTG"),

                fecha_firma=row.get("FECHAFIRMA"),
                apoderado=row.get("APODERADO"),
                fecha_inscripcion=row.get("FECHAINSCRIPCION"),

                actividad_actual=row.get("ACTIVIDADACTUAL"),
                estado_actividad=row.get("ESTADOACTIVIDAD"),
                fecha_inicio_actividad=row.get("FECHAINICIOACTIVIDAD"),
                fecha_fin_actividad=row.get("FECHAFINACTIVIDAD"),

                contrato=row.get("CONTRATO"),
                num_solicitud_sia=row.get("NUMSOLICITUDSIA"),
                tipo_operacion=row.get("TIPOOPERACION"),
                subtipo_operacion=row.get("SUBTIPOOPERACION"),

                oficina=row.get("OFICINA"),
                dan=row.get("DAN"),
                oficina_alta=row.get("OFICINAALTA"),

                capital=row.get("CAPITAL"),
                importe=row.get("IMPORTE"),
                saldo_real=row.get("SALDOREAL"),
                saldo_disponible=row.get("SALDODISPONIBLE"),

                vinccanc=row.get("VINCCANC"),
                protocolo=row.get("PROTOCOLO"),

                nombre_titular=row.get("NOMBRETITULAR"),
                nif_titular=row.get("NIFTITULAR"),

                nombre_notario=row.get("NOMBRENOTARIO"),
                nif_notario=row.get("NIFNOTARIO"),

                estado_expediente_ancert=row.get("ESTADOEXPEDIENTEANCERT"),
                id_expediente_cgn=row.get("IDEXPEDIENTECGN"),
                fecha_sol_cgn=row.get("FECHASOLCGN"),
                fecha_entregado_cliente=row.get("FECHAENTREGADOCLIENTE"),
                fecha_prevista_firma=row.get("FECHAPREVISTAFIRMA"),
                fecha_vencimiento=row.get("FECHAVENCIMIENTO"),

                notario=row.get("NOTARIO"),
                tipo_acta=row.get("TIPOACTA"),
                fecha_firma_prev_val=row.get("FECHAFIRMAPREVVAL"),
                fecha_firma_prev_cli=row.get("FECHAFIRMAPREVCLI"),

                lucy=row.get("LUCY"),
                indicador_tt=row.get("INDICADORTT"),
            )
            db.add(exp)
            creados += 1

        else:
            # Actualización básica
            exp.estado_expediente = row.get("ESTADOEXPEDIENTE")
            exp.producto_gtg = row.get("PRODUCTOGTG")
            exp.actividad_actual = row.get("ACTIVIDADACTUAL")
            actualizados += 1

        db.flush()

        # ============================
        # 4) FINCA
        # ============================
        finca_num = row.get("FINCA")
        if finca_num:
            db.add(ExpedienteFinca(
                expediente_id=exp.id,
                numero_finca=str(finca_num)
            ))

        # ============================
        # 5) PROVISIÓN
        # ============================
        if row.get("IDPROVISION") or row.get("TIPOPROVISION"):
            db.add(ExpedienteProvision(
                expediente_id=exp.id,
                id_provision=row.get("IDPROVISION"),
                tipo_provision=row.get("TIPOPROVISION")
            ))

        # ============================
        # 6) GESTORÍA
        # ============================
        if row.get("IDGESTORIATRAMITE") or row.get("NOMBREGESTORIA"):
            db.add(ExpedienteGestoria(
                expediente_id=exp.id,
                id_gestoria_tramite=row.get("IDGESTORIATRAMITE"),
                nombre_gestoria=row.get("NOMBREGESTORIA")
            ))

        # ============================
        # 7) DEFECTOS
        # ============================
        if row.get("TIENEDEFECTOSABIERTOS") or row.get("TIPOERROR"):
            db.add(ExpedienteDefecto(
                expediente_id=exp.id,
                tiene_defectos_abiertos=row.get("TIENEDEFECTOSABIERTOS"),
                tipo_error=row.get("TIPOERROR"),
                descripcion_error=row.get("DESCRIPCIONERROR"),
                falta_defecto=row.get("FALTADEFECTO"),
                fecha_cierre_defecto=row.get("FCIERREDEFECTO")
            ))

    db.commit()

    return {
        "creados": creados,
        "actualizados": actualizados
    }
