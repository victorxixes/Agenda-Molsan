import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import RequireAuth from "./components/auth/RequireAuth";

/* LAYOUT */
import Layout from "./layout/Layout";

/* LOGIN */
import LoginPage from "./pages/LoginPage";

/* DASHBOARD */
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import DashboardExtendido from "./pages/dashboard/DashboardExtendido.jsx";

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
import { useAuthStore } from "./store/authStore";

function MensajesWrapper() {
  const empleado = useAuthStore((s) => s.empleado);
  return <Mensajes usuarioId={empleado?.id} />;
}

<Route path="mensajes" element={<MensajesWrapper />} />


/* HERRAMIENTAS */
import Herramientas from "./pages/herramientas/Herramientas.jsx";
import ImportarCTN from "./pages/herramientas/ImportarCTN.jsx";
import Utilidades from "./pages/herramientas/Utilidades.jsx";

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
import SeguridadModulos from "./pages/seguridad/SeguridadModulos.jsx;
import SeguridadPermisos from "./pages/seguridad/SeguridadPermisos.jsx";
import SeguridadFicha from "./pages/seguridad/SeguridadFicha.jsx";
import SeguridadAuditoria from "./pages/seguridad/SeguridadAuditoria.jsx";
import SeguridadLogs from "./pages/seguridad/SeguridadLogs.jsx";
import SeguridadRolEditor from "./pages/seguridad/SeguridadRolEditor.jsx";

export default function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* ERP PROTEGIDO */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        {/* REDIRECCIÓN INICIAL */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* DASHBOARD */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/extendido" element={<DashboardExtendido />} />

        {/* AGENDA */}
        <Route path="agenda" element={<Agenda />} />
        <Route path="agenda/dia" element={<VistaDia />} />
        <Route path="agenda/semana" element={<VistaSemana />} />
        <Route path="agenda/mes" element={<VistaMes />} />

        {/* CTN */}
        <Route path="ctn" element={<Ctn />} />
        <Route path="ctn/listado" element={<CtnListadoPage />} />
        <Route path="ctn/:id" element={<CtnDetallePage />} />

        {/* EMPLEADOS */}
        <Route path="panel/empleados" element={<EmpleadosModulo2026 />} />
        <Route path="panel/empleados/listado" element={<EmpleadosListado />} />
        <Route path="panel/empleados/:id" element={<EmpleadoFicha />} />
        <Route path="panel/empleados/:id/editar" element={<EmpleadoEditar />} />

        {/* INTRANET */}
        <Route path="intranet" element={<Intranet />} />

        {/* MENSAJES */}
        <Route path="mensajes" element={<Mensajes />} />

        {/* HERRAMIENTAS */}
        <Route path="herramientas" element={<Herramientas />} />
        <Route path="herramientas/importar-ctn" element={<ImportarCTN />} />
        <Route path="herramientas/utilidades" element={<Utilidades />} />

        {/* LOGS */}
        <Route path="logs" element={<Logs />} />

        {/* NOTIFICACIONES */}
        <Route path="notificaciones" element={<Notificaciones />} />

        {/* PANEL TÉCNICO */}
        <Route path="panel-tecnico" element={<PanelTecnico />} />
        <Route path="panel-tecnico/monitor-sistema" element={<MonitorSistema />} />
        <Route path="panel-tecnico/monitor-realtime" element={<MonitorRealtime />} />
        <Route path="panel-tecnico/auditoria-avanzada" element={<AuditoriaAvanzada />} />
        <Route path="panel-tecnico/logs-avanzados" element={<LogsAvanzados />} />

        {/* SEGURIDAD */}
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
    </Routes>
  );
}
