import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import RequireAuth from "./components/auth/RequireAuth";

/* LAYOUT */
import Layout from "./layout/Layout";

/* LOGIN */
import LoginPage from "./pages/LoginPage";

/* EMPLEADOS */
import EmpleadosModulo2026 from "./pages/empleados/EmpleadosModulo2026.jsx";

/* CTN */
import Ctn from "./pages/ctn/Ctn.jsx";
import CtnDetallePage from "./pages/ctn/CtnDetallePage.jsx";

/* LOGS */
import Logs from "./pages/logs/Logs.jsx";

/* HERRAMIENTAS */
import Herramientas from "./pages/herramientas/Herramientas.jsx";
import ImportarCTN from "./pages/herramientas/ImportarCTN.jsx";
import Utilidades from "./pages/herramientas/Utilidades.jsx";
import InicializacionPage from "./pages/herramientas/InicializacionPage.jsx";

/* SEGURIDAD */
import Seguridad from "./pages/seguridad/Seguridad.jsx";
import SeguridadUsuarios from "./pages/seguridad/SeguridadUsuarios.jsx";
import SeguridadFicha from "./pages/seguridad/SeguridadFicha.jsx";
import SeguridadAuditoria from "./pages/seguridad/SeguridadAuditoria.jsx";
import SeguridadLogs from "./pages/seguridad/SeguridadLogs.jsx";
import SeguridadRolEditor from "./pages/seguridad/SeguridadRolEditor.jsx";

/* AGENDA */
import AgendaPage from "./pages/agenda/AgendaPage.jsx";
import MisVisitasPage from "./pages/agenda/MisVisitasPage.jsx";

/* INTRANET */
import IntranetPage from "./pages/intranet/IntranetPage.jsx";
import DocumentosPage from "./pages/intranet/DocumentosPage.jsx";
import NoticiasPage from "./pages/intranet/NoticiasPage.jsx";

/* MENSAJES */
import MensajesPage from "./pages/mensajes/MensajesPage.jsx";

/* DASHBOARD */
import DashboardGeneral from "./pages/dashboard/DashboardGeneral.jsx";

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
        <Route path="dashboard" element={<DashboardGeneral />} />

        {/* AGENDA */}
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="agenda/mis-visitas" element={<MisVisitasPage />} />

        {/* EMPLEADOS */}
        <Route path="panel/empleados" element={<EmpleadosModulo2026 />} />

        {/* CTN */}
        <Route path="ctn" element={<Ctn />} />
        <Route path="ctn/:id" element={<CtnDetallePage />} />

        {/* INTRANET */}
        <Route path="intranet" element={<IntranetPage />} />
        <Route path="intranet/documentos" element={<DocumentosPage />} />
        <Route path="intranet/noticias" element={<NoticiasPage />} />

        {/* MENSAJES */}
        <Route path="mensajes" element={<MensajesPage />} />

        {/* HERRAMIENTAS */}
        <Route path="herramientas" element={<Herramientas />} />
        <Route path="herramientas/importar-ctn" element={<ImportarCTN />} />
        <Route path="herramientas/utilidades" element={<Utilidades />} />
        <Route path="herramientas/inicializacion" element={<InicializacionPage />} />

        {/* SEGURIDAD */}
        <Route path="seguridad" element={<Seguridad />} />
        <Route path="seguridad/usuarios" element={<SeguridadUsuarios />} />
        <Route path="seguridad/ficha/:id" element={<SeguridadFicha />} />
        <Route path="seguridad/auditoria" element={<SeguridadAuditoria />} />
        <Route path="seguridad/logs" element={<SeguridadLogs />} />
        <Route path="seguridad/roles/editor" element={<SeguridadRolEditor />} />
      </Route>
    </Routes>
  );
}
