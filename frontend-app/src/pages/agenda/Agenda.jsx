import { useState, useEffect, useCallback, useMemo } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useAuthStore } from "../../store/authStore";

import VistaMes from "./VistaMes";
import VistaSemana from "./VistaSemana";
import VistaDia from "./VistaDia";

import ModalNuevaCita from "../../components/agenda/ModalNuevaCita.jsx";
import AgendaToast from "../../components/agenda/AgendaToast.jsx";

import SelectSJ from "../../components/ui/SelectSJ";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function Agenda() {
  const hoy = useMemo(() => new Date(), []);

  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);
  const [vista, setVista] = useState("mes");

  const {
    citas,
    cargarMes,
    crear,
    editar,
    eliminar,
    marcarResaltada,
    notify,
  } = useAgendaStore();

  // ============================================================
  // PERMISOS
  // ============================================================

  const permisosAgenda = useAuthStore((s) => {
    const mod = s.empleado?.permisos_modulo;

    if (!mod) return [];
    if (!Array.isArray(mod.agenda)) return [];

    return mod.agenda;
  });

  const puedeCrear = permisosAgenda.includes("crear");
  const puedeEditar = permisosAgenda.includes("editar");
  const puedeEliminar = permisosAgenda.includes("eliminar");

  const puedeVer =
    permisosAgenda.includes("ver") ||
    permisosAgenda.includes("editar") ||
    permisosAgenda.includes("crear") ||
    permisosAgenda.includes("eliminar");

  // ============================================================
  // ESTADO MODAL
  // ============================================================

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalModo, setModalModo] = useState("crear");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  // ============================================================
  // CARGAR MES
  // ============================================================

  useEffect(() => {
    cargarMes(year, month);
  }, [year, month, cargarMes]);

  // ============================================================
  // CREAR CITA
  // ============================================================

  const abrirCrear = useCallback(
    (fecha) => {
      if (!puedeCrear) {
        notify("No tienes permiso para crear citas.");
        return;
      }

      setModalModo("crear");
      setFechaSeleccionada(fecha);
      setCitaSeleccionada(null);
      setMostrarModal(true);
    },
    [puedeCrear, notify]
  );

  // ============================================================
  // ABRIR CITA
  // ============================================================

  const abrirEditar = useCallback(
    async (cita) => {
      try {
        const res = await fetch(
          `https://agenda-intranet-b.onrender.com/api/agenda/${cita.id}`
        );

        const citaCompleta = await res.json();

        setModalModo(puedeEditar ? "editar" : "ver");
        setFechaSeleccionada(citaCompleta.fecha);
        setCitaSeleccionada(citaCompleta);
        setMostrarModal(true);
      } catch (err) {
        console.error("Error cargando cita completa:", err);
        notify("Error al cargar la cita.");
      }
    },
    [puedeEditar, notify]
  );

  // ============================================================
  // GUARDAR CITA
  // ============================================================

  const guardarCita = useCallback(
    async (payload) => {
      try {
        // --------------------------------------------------------
        // CREAR
        // --------------------------------------------------------

        if (modalModo === "crear") {
          if (!puedeCrear) {
            notify("No tienes permiso para crear citas.");
            return;
          }

          const creada = await crear(payload, year, month);

          if (creada?.id) {
            marcarResaltada(creada.id);
            notify("Cita creada correctamente.");
          }
        }

        // --------------------------------------------------------
        // EDITAR
        // --------------------------------------------------------

        else if (modalModo === "editar" && citaSeleccionada) {
          if (!puedeEditar) {
            notify("No tienes permiso para editar citas.");
            return;
          }

          const editada = await editar(
            citaSeleccionada.id,
            payload,
            year,
            month
          );

          if (editada?.id) {
            marcarResaltada(editada.id);
            notify("Cita actualizada correctamente.");
          }
        }

        // --------------------------------------------------------
        // SOLO VISUALIZACIÓN
        // --------------------------------------------------------

        else if (modalModo === "ver") {
          setMostrarModal(false);
          return;
        }

        setMostrarModal(false);
      } catch (err) {
        console.error("ERROR AL GUARDAR CITA:", err);
        notify("Error al guardar la cita.");
      }
    },
    [
      modalModo,
      citaSeleccionada,
      crear,
      editar,
      marcarResaltada,
      notify,
      year,
      month,
      puedeCrear,
      puedeEditar,
    ]
  );

  // ============================================================
  // ELIMINAR CITA
  // ============================================================

  const borrarCita = useCallback(async () => {
    if (!citaSeleccionada) return;

    if (!puedeEliminar) {
      notify("No tienes permiso para eliminar citas.");
      return;
    }

    try {
      await eliminar(citaSeleccionada.id, year, month);

      notify("Cita eliminada.");
      setMostrarModal(false);
    } catch (err) {
      console.error("ERROR AL ELIMINAR CITA:", err);
      notify("Error al eliminar la cita.");
    }
  }, [
    citaSeleccionada,
    eliminar,
    notify,
    year,
    month,
    puedeEliminar,
  ]);

  // ============================================================
  // NAVEGACIÓN DE MESES
  // ============================================================

  const mesAnterior = useCallback(() => {
    setMonth((m) => {
      if (m === 1) {
        setYear((y) => y - 1);
        return 12;
      }

      return m - 1;
    });
  }, []);

  const mesSiguiente = useCallback(() => {
    setMonth((m) => {
      if (m === 12) {
        setYear((y) => y + 1);
        return 1;
      }

      return m + 1;
    });
  }, []);

  // ============================================================
  // CITAS SEGURAS
  // ============================================================

  const citasSeguras = useMemo(
    () => (Array.isArray(citas) ? citas : []),
    [citas]
  );

  // ============================================================
  // EVENTOS
  // ============================================================

  const handleCitaClick = useCallback(
    (cita) => {
      abrirEditar(cita);
    },
    [abrirEditar]
  );

  const handleDiaClick = useCallback(
    (fecha) => {
      abrirCrear(fecha);
    },
    [abrirCrear]
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="container-sj animate-fade-in">
      {/* ========================================================
          CABECERA
          ======================================================== */}

      <section className="mb-6">
        <div
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            p-6
            shadow-sm
          "
        >
          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
            "
            style={{ color: "var(--erp-text)" }}
          >
            Agenda corporativa
          </h1>

          <p
            className="mt-1 text-sm"
            style={{ color: "var(--sj-azul-claro)" }}
          >
            Calendario de citas SJ-2026.
          </p>
        </div>
      </section>

      {/* ========================================================
          SELECTOR DE FECHA Y VISTA
          ======================================================== */}

      <section className="mb-6">
        <div
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            p-4
            shadow-sm
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          {/* ----------------------------------------------------
              MES ANTERIOR
              ---------------------------------------------------- */}

          <button
            type="button"
            onClick={mesAnterior}
            className="
              h-10
              min-w-10
              px-3
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              font-medium
              hover:bg-slate-50
              hover:border-slate-300
              transition
              active:scale-95
            "
            aria-label="Mes anterior"
            title="Mes anterior"
          >
            ←
          </button>

          {/* ----------------------------------------------------
              AÑO
              ---------------------------------------------------- */}

          <SelectSJ
            value={year}
            onChange={(v) => setYear(parseInt(v, 10))}
            options={Array.from({ length: 10 }, (_, i) => {
              const y = hoy.getFullYear() - 5 + i;

              return {
                value: y,
                label: y,
              };
            })}
            className="w-32"
          />

          {/* ----------------------------------------------------
              MES
              ---------------------------------------------------- */}

          <SelectSJ
            value={month}
            onChange={(v) => setMonth(parseInt(v, 10))}
            options={MESES.map((nombre, index) => ({
              value: index + 1,
              label: nombre,
            }))}
            className="w-40"
          />

          {/* ----------------------------------------------------
              MES SIGUIENTE
              ---------------------------------------------------- */}

          <button
            type="button"
            onClick={mesSiguiente}
            className="
              h-10
              min-w-10
              px-3
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              font-medium
              hover:bg-slate-50
              hover:border-slate-300
              transition
              active:scale-95
            "
            aria-label="Mes siguiente"
            title="Mes siguiente"
          >
            →
          </button>

          {/* ----------------------------------------------------
              SEPARADOR
              ---------------------------------------------------- */}

          <div className="hidden md:block h-8 w-px bg-slate-200 mx-2" />

          {/* ----------------------------------------------------
              VISTAS
              ---------------------------------------------------- */}

          <div className="ml-auto flex items-center gap-2">
            {[
              { value: "mes", label: "Mes" },
              { value: "semana", label: "Semana" },
              { value: "dia", label: "Día" },
            ].map((opcion) => {
              const activa = vista === opcion.value;

              return (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => setVista(opcion.value)}
                  className={`
                    px-4
                    py-2
                    rounded-xl
                    border
                    text-sm
                    font-medium
                    transition
                    active:scale-95
                    ${
                      activa
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }
                  `}
                >
                  {opcion.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          VISTA DEL CALENDARIO
          ======================================================== */}

      <section>
        <div
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            p-4
            shadow-sm
            overflow-hidden
          "
        >
          {vista === "mes" && (
            <VistaMes
              year={year}
              month={month}
              citas={citasSeguras}
              onDiaClick={handleDiaClick}
              onCitaClick={handleCitaClick}
            />
          )}

          {vista === "semana" && (
            <VistaSemana
              fechaBase={`${year}-${String(month).padStart(2, "0")}-01`}
              citas={citasSeguras}
              onCitaClick={handleCitaClick}
              onCrearCita={handleDiaClick}
            />
          )}

          {vista === "dia" && (
            <VistaDia
              fechaDia={new Date()}
              citas={citasSeguras}
              onCitaClick={handleCitaClick}
              onCrearCita={handleDiaClick}
            />
          )}
        </div>
      </section>

      {/* ========================================================
          MODAL NUEVA CITA / EDICIÓN
          ======================================================== */}

      {mostrarModal && (
        <ModalNuevaCita
          fecha={fechaSeleccionada}
          modo={modalModo}
          cita={citaSeleccionada}
          onClose={() => setMostrarModal(false)}
          onGuardar={guardarCita}
          onDelete={
            modalModo === "editar" && puedeEliminar
              ? borrarCita
              : null
          }
        />
      )}

      {/* ========================================================
          TOAST
          ======================================================== */}

      <AgendaToast />
    </div>
  );
}
