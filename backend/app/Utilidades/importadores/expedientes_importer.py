import pandas as pd
from sqlalchemy.orm import Session
from backend.app.expedientes.clientes.models import Cliente
from backend.app.expedientes.models import Expediente


def importar_excel_expedientes(db: Session, contenido_excel: bytes):
    df = pd.read_excel(contenido_excel)

    creados = 0
    actualizados = 0

    for _, row in df.iterrows():

        # ============================
        # 1) ID EXPEDIENTE
        # ============================
        idexp = str(row.get("IDEXPEDIENTE")).strip() if row.get("IDEXPEDIENTE") else None
        if not idexp:
            continue

        # ============================
        # 2) CLIENTE (TITULAR)
        # ============================
        nif_sol = str(row.get("NIFSOLICITANTE")).strip() if row.get("NIFSOLICITANTE") else None
        nombre_sol = str(row.get("NOMBRESOLICITANTE")).strip() if row.get("NOMBRESOLICITANTE") else ""

        cliente = None
        if nif_sol:
            cliente = db.query(Cliente).filter(Cliente.dni == nif_sol).first()
            if not cliente:
                cliente = Cliente(
                    dni=nif_sol,
                    nombre_completo=nombre_sol,
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

                # ESTADOS
                estado_expediente=row.get("ESTADOEXPEDIENTE"),
                estado_expediente_ancert=row.get("ESTADOEXPEDIENTEANCERT"),

                # FECHAS
                fecha_alta=row.get("FECHAALTA"),
                fecha_firma=row.get("FECHAFIRMA"),
                fecha_inscripcion=row.get("FECHAINSCRIPCION"),
                fecha_entregado_cliente=row.get("FECHAENTREGADOCLIENTE"),
                fecha_prevista_firma=row.get("FECHAPREVISTAFIRMA"),
                fecha_vencimiento=row.get("FECHAVENCIMIENTO"),
                fecha_sol_cgn=row.get("FECHASOLCGN"),
                fecha_firma_prev_val=row.get("FECHAFIRMAPREVVAL"),
                fecha_firma_prev_cli=row.get("FECHAFIRMAPREVCLI"),

                # TITULAR
                nombre_titular=row.get("NOMBRETITULAR"),
                nif_titular=row.get("NIFTITULAR"),

                # NOTARIO
                nombre_notario=row.get("NOMBRENOTARIO"),
                nif_notario=row.get("NIFNOTARIO"),
                notario=row.get("NOTARIO"),

                # OFICINA
                oficina=row.get("OFICINA"),
                oficina_alta=row.get("OFICINAALTA"),
                dan=row.get("DAN"),

                # ECONÓMICOS
                capital=row.get("CAPITAL"),
                importe=row.get("IMPORTE"),
                saldo_real=row.get("SALDOREAL"),
                saldo_disponible=row.get("SALDODISPONIBLE"),

                # OPERACIÓN
                contrato=row.get("CONTRATO"),
                num_solicitud_sia=row.get("NUMSOLICITUDSIA"),
                tipo_operacion=row.get("TIPOOPERACION"),
                subtipo_operacion=row.get("SUBTIPOOPERACION"),
                vinccanc=row.get("VINCCANC"),
                protocolo=row.get("PROTOCOLO"),

                # GTG / BANKIA
                origen_bankia=row.get("ORIGENBANKIA"),
                producto_gtg=row.get("PRODUCTOGTG"),
                dt=row.get("DT"),

                # ACTIVIDAD
                actividad_actual=row.get("ACTIVIDADACTUAL"),
                estado_actividad=row.get("ESTADOACTIVIDAD"),
                fecha_inicio_actividad=row.get("FECHAINICIOACTIVIDAD"),
                fecha_fin_actividad=row.get("FECHAFINACTIVIDAD"),

                # CGN
                id_expediente_cgn=row.get("IDEXPEDIENTECGN"),

                # OTROS
                lucy=row.get("LUCY"),
                indicador_tt=row.get("INDICADORTT"),

                # OBSERVACIONES
                observaciones=row.get("OBSERVACIONES"),

                # EXTRA (FACTURACIÓN / REGISTRAL)
                facturacion_estado=row.get("FACTURACIONESTADO"),
                facturacion_fecha=row.get("FACTURACIONFECHA"),
                registral_estado=row.get("REGISTRALESTADO"),
                registral_fecha=row.get("REGISTRALFECHA"),
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

    db.commit()

    return {
        "creados": creados,
        "actualizados": actualizados
    }
