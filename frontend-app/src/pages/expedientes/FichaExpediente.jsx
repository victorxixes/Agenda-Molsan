import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { obtenerExpediente } from "../../api/expedientes";


// ============================================================
// FORMATEADORES
// ============================================================

function valorVisible(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "—";
  }

  return String(valor);
}


function formatearFecha(valor) {
  if (!valor) {
    return "—";
  }

  const fecha = String(valor);

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const [year, month, day] = fecha.split("-");

    return `${day}/${month}/${year}`;
  }

  return fecha;
}


function formatearNumero(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "—";
  }

  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return String(valor);
  }

  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numero);
}


// ============================================================
// COMPONENTES VISUALES
// ============================================================

function Dato({
  campo,
  valor,
  tipo = "texto",
}) {
  let contenido = valorVisible(valor);

  if (tipo === "fecha") {
    contenido = formatearFecha(valor);
  }

  if (tipo === "numero") {
    contenido = formatearNumero(valor);
  }

  return (
    <div
      className="
        rounded-xl
        border
        border-white/10
        bg-white/5
        p-3
      "
    >
      <p className="text-xs text-white/50 mb-1">
        {campo}
      </p>

      <p className="text-sm text-white font-medium break-words">
        {contenido}
      </p>
    </div>
  );
}


function Seccion({
  titulo,
  children,
}) {
  return (
    <section
      className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/10
        rounded-2xl
        p-5
        shadow-xl
      "
    >
      <h2
        className="
          text-lg
          font-semibold
          text-white
          mb-4
        "
      >
        {titulo}
      </h2>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-3
        "
      >
        {children}
      </div>
    </section>
  );
}


// ============================================================
// FICHA
// ============================================================

export default function FichaExpediente() {
  const { id } = useParams();

  const [expediente, setExpediente] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================================
  // CARGAR
  // ==========================================================

  useEffect(() => {
    let activo = true;

    async function cargar() {
      setLoading(true);
      setError("");

      try {
        const data = await obtenerExpediente(id);

        if (activo) {
          setExpediente(data);
        }
      } catch (err) {
        console.error(
          "Error cargando expediente:",
          err
        );

        if (activo) {
          setError(
            err?.response?.data?.detail ||
              "No se ha podido cargar el expediente."
          );

          setExpediente(null);
        }
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    }

    cargar();

    return () => {
      activo = false;
    };
  }, [id]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="p-6 text-white/70">
        Cargando expediente…
      </div>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <Link
          to="/expedientes"
          className="
            inline-block
            text-blue-400
            hover:text-blue-300
          "
        >
          ← Volver a expedientes
        </Link>

        <div
          className="
            bg-red-500/20
            border
            border-red-400/30
            rounded-xl
            p-4
            text-red-200
          "
        >
          {error}
        </div>
      </div>
    );
  }


  if (!expediente) {
    return (
      <div className="p-6">
        <div className="text-red-400">
          Expediente no encontrado.
        </div>
      </div>
    );
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        p-6
        text-white
        space-y-6
        animate-fade-in
      "
    >

      {/* ======================================================
          CABECERA
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >
        <div>
          <Link
            to="/expedientes"
            className="
              text-sm
              text-blue-400
              hover:text-blue-300
            "
          >
            ← Volver a expedientes
          </Link>

          <h1
            className="
              text-3xl
              font-bold
              mt-2
              drop-shadow
            "
          >
            Expediente{" "}
            {valorVisible(
              expediente.id_expediente
            )}
          </h1>
        </div>

        <div
          className="
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
          "
        >
          <p className="text-xs text-white/50">
            ID interno
          </p>

          <p className="font-semibold">
            {valorVisible(expediente.id)}
          </p>
        </div>
      </div>


      {/* ======================================================
          ESTADOS
      ====================================================== */}

      <Seccion titulo="Estado del expediente">

        <Dato
          campo="Estado expediente"
          valor={expediente.estado_expediente}
        />

        <Dato
          campo="Estado ANCERT"
          valor={expediente.estado_expediente_ancert}
        />

        <Dato
          campo="Estado actividad"
          valor={expediente.estado_actividad}
        />

        <Dato
          campo="Actividad actual"
          valor={expediente.actividad_actual}
        />

        <Dato
          campo="Tiene defectos abiertos"
          valor={expediente.tiene_defectos_abiertos}
        />

        <Dato
          campo="Estado facturación"
          valor={expediente.facturacion_estado}
        />

        <Dato
          campo="Estado registral"
          valor={expediente.registral_estado}
        />

      </Seccion>


      {/* ======================================================
          IDENTIFICACIÓN
      ====================================================== */}

      <Seccion titulo="Identificación">

        <Dato
          campo="ID expediente"
          valor={expediente.id_expediente}
        />

        <Dato
          campo="ID interno"
          valor={expediente.id}
          tipo="numero"
        />

        <Dato
          campo="ID cliente"
          valor={expediente.cliente_id}
          tipo="numero"
        />

        <Dato
          campo="Contrato"
          valor={expediente.contrato}
        />

        <Dato
          campo="Tipo operación"
          valor={expediente.tipo_operacion}
        />

        <Dato
          campo="Subtipo operación"
          valor={expediente.subtipo_operacion}
        />

        <Dato
          campo="Nº solicitud SIA"
          valor={expediente.num_solicitud_sia}
        />

        <Dato
          campo="VincCanc"
          valor={expediente.vinccanc}
        />

        <Dato
          campo="Protocolo"
          valor={expediente.protocolo}
        />

        <Dato
          campo="Tipo acta"
          valor={expediente.tipo_acta}
        />

      </Seccion>


      {/* ======================================================
          TITULAR
      ====================================================== */}

      <Seccion titulo="Titular">

        <Dato
          campo="Nombre titular"
          valor={expediente.nombre_titular}
        />

        <Dato
          campo="NIF titular"
          valor={expediente.nif_titular}
        />

        <Dato
          campo="ID cliente"
          valor={expediente.cliente_id}
          tipo="numero"
        />

      </Seccion>


      {/* ======================================================
          SOLICITANTE
      ====================================================== */}

      <Seccion titulo="Solicitante">

        <Dato
          campo="Nombre solicitante"
          valor={expediente.nombre_solicitante}
        />

        <Dato
          campo="NIF solicitante"
          valor={expediente.nif_solicitante}
        />

        <Dato
          campo="Apoderado"
          valor={expediente.apoderado}
        />

      </Seccion>


      {/* ======================================================
          NOTARIO
      ====================================================== */}

      <Seccion titulo="Notario">

        <Dato
          campo="Nombre notario"
          valor={expediente.nombre_notario}
        />

        <Dato
          campo="NIF notario"
          valor={expediente.nif_notario}
        />

        <Dato
          campo="Notario"
          valor={expediente.notario}
        />

      </Seccion>


      {/* ======================================================
          OFICINA
      ====================================================== */}

      <Seccion titulo="Oficina">

        <Dato
          campo="Oficina"
          valor={expediente.oficina}
        />

        <Dato
          campo="DAN"
          valor={expediente.dan}
        />

        <Dato
          campo="Oficina alta"
          valor={expediente.oficina_alta}
        />

      </Seccion>


      {/* ======================================================
          FECHAS
      ====================================================== */}

      <Seccion titulo="Fechas">

        <Dato
          campo="Fecha alta"
          valor={expediente.fecha_alta}
          tipo="fecha"
        />

        <Dato
          campo="Fecha firma"
          valor={expediente.fecha_firma}
          tipo="fecha"
        />

        <Dato
          campo="Fecha inscripción"
          valor={expediente.fecha_inscripcion}
          tipo="fecha"
        />

        <Dato
          campo="Fecha entregado cliente"
          valor={expediente.fecha_entregado_cliente}
          tipo="fecha"
        />

        <Dato
          campo="Fecha prevista firma"
          valor={expediente.fecha_prevista_firma}
          tipo="fecha"
        />

        <Dato
          campo="Fecha vencimiento"
          valor={expediente.fecha_vencimiento}
          tipo="fecha"
        />

        <Dato
          campo="Fecha solicitud CGN"
          valor={expediente.fecha_sol_cgn}
          tipo="fecha"
        />

        <Dato
          campo="Fecha firma prevista validación"
          valor={expediente.fecha_firma_prev_val}
          tipo="fecha"
        />

        <Dato
          campo="Fecha firma prevista cliente"
          valor={expediente.fecha_firma_prev_cli}
          tipo="fecha"
        />

        <Dato
          campo="Inicio actividad"
          valor={expediente.fecha_inicio_actividad}
          tipo="fecha"
        />

        <Dato
          campo="Fin actividad"
          valor={expediente.fecha_fin_actividad}
          tipo="fecha"
        />

        <Dato
          campo="Fecha cierre defecto"
          valor={expediente.fcierre_defecto}
          tipo="fecha"
        />

        <Dato
          campo="Fecha facturación"
          valor={expediente.facturacion_fecha}
          tipo="fecha"
        />

        <Dato
          campo="Fecha registral"
          valor={expediente.registral_fecha}
          tipo="fecha"
        />

      </Seccion>


      {/* ======================================================
          ACTIVIDAD
      ====================================================== */}

      <Seccion titulo="Actividad">

        <Dato
          campo="Actividad actual"
          valor={expediente.actividad_actual}
        />

        <Dato
          campo="Estado actividad"
          valor={expediente.estado_actividad}
        />

        <Dato
          campo="Inicio actividad"
          valor={expediente.fecha_inicio_actividad}
          tipo="fecha"
        />

        <Dato
          campo="Fin actividad"
          valor={expediente.fecha_fin_actividad}
          tipo="fecha"
        />

      </Seccion>


      {/* ======================================================
          ECONÓMICO
      ====================================================== */}

      <Seccion titulo="Importes y saldos">

        <Dato
          campo="Capital"
          valor={expediente.capital}
          tipo="numero"
        />

        <Dato
          campo="Importe"
          valor={expediente.importe}
          tipo="numero"
        />

        <Dato
          campo="Saldo real"
          valor={expediente.saldo_real}
          tipo="numero"
        />

        <Dato
          campo="Saldo disponible"
          valor={expediente.saldo_disponible}
          tipo="numero"
        />

      </Seccion>


      {/* ======================================================
          PROVISIÓN
      ====================================================== */}

      <Seccion titulo="Provisión">

        <Dato
          campo="ID provisión"
          valor={expediente.id_provision}
        />

        <Dato
          campo="Tipo provisión"
          valor={expediente.tipo_provision}
        />

      </Seccion>


      {/* ======================================================
          GESTORÍA
      ====================================================== */}

      <Seccion titulo="Gestoría">

        <Dato
          campo="ID gestoría trámite"
          valor={expediente.id_gestoria_tramite}
        />

        <Dato
          campo="Nombre gestoría"
          valor={expediente.nombre_gestoria}
        />

        <Dato
          campo="Gestoría"
          valor={expediente.gestoria}
        />

      </Seccion>


      {/* ======================================================
          FINCA
      ====================================================== */}

      <Seccion titulo="Finca">

        <Dato
          campo="Finca"
          valor={expediente.finca}
        />

      </Seccion>


      {/* ======================================================
          DEFECTOS
      ====================================================== */}

      <Seccion titulo="Defectos">

        <Dato
          campo="Tiene defectos abiertos"
          valor={expediente.tiene_defectos_abiertos}
        />

        <Dato
          campo="Tipo error"
          valor={expediente.tipo_error}
        />

        <Dato
          campo="Descripción error"
          valor={expediente.descripcion_error}
        />

        <Dato
          campo="Falta / defecto"
          valor={expediente.falta_defecto}
        />

        <Dato
          campo="Fecha cierre defecto"
          valor={expediente.fcierre_defecto}
          tipo="fecha"
        />

      </Seccion>


      {/* ======================================================
          CGN
      ====================================================== */}

      <Seccion titulo="CGN">

        <Dato
          campo="ID expediente CGN"
          valor={expediente.id_expediente_cgn}
        />

        <Dato
          campo="Fecha solicitud CGN"
          valor={expediente.fecha_sol_cgn}
          tipo="fecha"
        />

      </Seccion>


      {/* ======================================================
          GTG / BANKIA
      ====================================================== */}

      <Seccion titulo="GTG / Bankia">

        <Dato
          campo="Origen Bankia"
          valor={expediente.origen_bankia}
        />

        <Dato
          campo="Producto GTG"
          valor={expediente.producto_gtg}
        />

        <Dato
          campo="DT"
          valor={expediente.dt}
        />

      </Seccion>


      {/* ======================================================
          OTROS
      ====================================================== */}

      <Seccion titulo="Otros">

        <Dato
          campo="Lucy"
          valor={expediente.lucy}
        />

        <Dato
          campo="Indicador TT"
          valor={expediente.indicador_tt}
        />

      </Seccion>


      {/* ======================================================
          OBSERVACIONES
      ====================================================== */}

      <section
        className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-2xl
          p-5
          shadow-xl
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            text-white
            mb-4
          "
        >
          Observaciones
        </h2>

        <div
          className="
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-4
            text-sm
            text-white/80
            whitespace-pre-wrap
            break-words
            min-h-[100px]
          "
        >
          {valorVisible(
            expediente.observaciones
          )}
        </div>
      </section>

    </div>
  );
}
