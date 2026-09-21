// ============================================================
// ERP SJ‑2026 — Sistema de rutas principal
// ============================================================

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

/* AUTH */
import RequireAuth from "./components/auth/RequireAuth";
import { useAuthStore } from "./store/authStore";

/* LAYOUT */
import Layout from "./layout/Layout";

/* LOGIN */
import LoginPage from "./pages/LoginPage";

/* DASHBOARD */
import Dashboard from "./pages/dashboard/Dashboard.jsx";

/* AGENDA */
import Agenda from "./pages/agenda/Agenda.jsx";
import VistaDia from "./pages/agenda/VistaDia.jsx";
import VistaSemana from "./pages/agenda/VistaSemana.jsx";
import VistaMes from "./pages/agenda/VistaMes.jsx";

/* CTN */
import Ctn from "./pages/ctn/Ctn.jsx";
import CtnDetallePage from "./pages/ctn/CtnDetallePage.jsx";
import CtnListadoPage from "./pages/ctn/CtnListadoPage.jsx";

/* EMPLEADOS */
import EmpleadosModulo2026 from "./pages/empleados/EmpleadosModulo2026.jsx";
import EmpleadosListado from "./pages/empleados/EmpleadosListado.jsx";
import EmpleadoFicha from "./pages/empleados/EmpleadoFicha.jsx";
import EmpleadoEditar from "./pages/empleados/EmpleadoEditar.jsx";

/* INTRANET */
import Intranet from "./pages/intranet/Intranet.jsx";

/* MENSAJES */
import Mensajes from "./pages/mensajes/Mensajes.jsx";

/* HERRAMIENTAS */
import Herramientas from "./pages/herramientas/Herramientas.jsx";
import ImportarCTN from "./pages/herramientas/ImportarCTN.jsx";
import Utilidades from "./pages/herramientas/Utilidades.jsx";
import CrearNoticia from "./pages/herramientas/CrearNoticia.jsx";
import SubirDocumento from "./pages/herramientas/SubirDocumento.jsx";

/* LOGS */
import Logs from "./pages/logs/Logs.jsx";

/* NOTIFICACIONES */
import Notificaciones from "./pages/notificaciones/Notificaciones.jsx";

/* PANEL TÉCNICO */
import PanelTecnico from "./pages/paneltecnico/PanelTecnico.jsx";
import MonitorSistema from "./pages/paneltecnico/MonitorSistema.jsx";
import MonitorRealtime from "./pages/paneltecnico/MonitorRealtime.jsx";
import AuditoriaAvanzada from "./pages/paneltecnico/AuditoriaAvanzada.jsx";
import LogsAvanzados from "./pages/paneltecnico/LogsAvanzados.jsx";

/* SEGURIDAD */
import Seguridad from "./pages/seguridad/Seguridad.jsx";
import SeguridadUsuarios from "./pages/seguridad/SeguridadUsuarios.jsx";
import SeguridadRoles from "./pages/seguridad/SeguridadRoles.jsx";
import SeguridadModulos from "./pages/seguridad/SeguridadModulos.jsx";
import SeguridadPermisos from "./pages/seguridad/SeguridadPermisos.jsx";
import SeguridadFicha from "./pages/seguridad/SeguridadFicha.jsx";
import SeguridadAuditoria from "./pages/seguridad/SeguridadAuditoria.jsx";
import SeguridadLogs from "./pages/seguridad/SeguridadLogs.jsx";
import SeguridadRolEditor from "./pages/seguridad/SeguridadRolEditor.jsx";

// ============================================================
// Wrapper SJ‑2026 para Mensajes
// ============================================================

function MensajesWrapper() {
  const empleado = useAuthStore((s) => s.empleado);

  if (!empleado || !empleado.id) {
    return (
      <div className="p-6 text-white/70">
        Cargando módulo de mensajes…
      </div>
    );
  }

  return <Mensajes usuarioId={empleado.id} />;
}

// ============================================================
// App — Router principal SJ‑2026
// ============================================================

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="animate-fade-in">
      <Routes>

        {/* 🔥 PRIMERA PÁGINA SIEMPRE LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔥 TODAS LAS RUTAS PRIVADAS */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="agenda" element={<Agenda />} />
          <Route path="agenda/dia" element={<VistaDia />} />
          <Route path="agenda/semana" element={<VistaSemana />} />
          <Route path="agenda/mes" element={<VistaMes />} />

          <Route path="ctn" element={<Ctn />} />
          <Route path="ctn/listado" element={<CtnListadoPage />} />
          <Route path="ctn/:id" element={<CtnDetallePage />} />

          <Route path="empleados" element={<EmpleadosModulo2026 />} />
          <Route path="empleados/listado" element={<EmpleadosListado />} />
          <Route path="empleados/:id" element={<EmpleadoFicha />} />
          <Route path="empleados/:id/editar" element={<EmpleadoEditar />} />

          <Route path="intranet" element={<Intranet />} />

          <Route path="mensajes" element={<MensajesWrapper />} />

          <Route path="herramientas" element={<Herramientas />} />
          <Route path="herramientas/importar-ctn" element={<ImportarCTN />} />
          <Route path="herramientas/utilidades" element={<Utilidades />} />
          <Route path="herramientas/utilidades/crear-noticia" element={<CrearNoticia />} />
          <Route path="herramientas/utilidades/subir-documento" element={<SubirDocumento />} />

          <Route path="logs" element={<Logs />} />

          <Route path="notificaciones" element={<Notificaciones />} />

          <Route path="paneltecnico" element={<PanelTecnico />} />
          <Route path="paneltecnico/monitor-sistema" element={<MonitorSistema />} />
          <Route path="paneltecnico/monitor-realtime" element={<MonitorRealtime />} />
          <Route path="paneltecnico/auditoria-avanzada" element={<AuditoriaAvanzada />} />
          <Route path="paneltecnico/logs-avanzados" element={<LogsAvanzados />} />

          <Route path="seguridad" element={<Seguridad />} />
          <Route path="seguridad/usuarios" element={<SeguridadUsuarios />} />
          <Route path="seguridad/roles" element={<SeguridadRoles />} />
          <Route path="seguridad/modulos" element={<SeguridadModulos />} />
          <Route path="seguridad/permisos" element={<SeguridadPermisos />} />
          <Route path="seguridad/ficha/:id" element={<SeguridadFicha />} />
          <Route path="seguridad/auditoria" element={<SeguridadAuditoria />} />
          <Route path="seguridad/logs" element={<SeguridadLogs />} />
          <Route path="seguridad/roles/editor" element={<SeguridadRolEditor />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
