import { Routes, Route, Navigate } from "react-router-dom";

/* LAYOUT */
import Layout from "./layout/Layout";

/* LOGIN */
import LoginPage from "./pages/LoginPage";

/* CTN */
import Ctn from "./pages/ctn/Ctn.jsx";
import CtnDetallePage from "./pages/ctn/CtnDetallePage.jsx";

/* LOGS (módulo general) */
import Logs from "./pages/logs/Logs.jsx";

/* HERRAMIENTAS */
import Herramientas from "./pages/herramientas/Herramientas.jsx";
import ImportarCTN from "./pages/herramientas/ImportarCTN.jsx";
import Utilidades from "./pages/herramientas/Utilidades.jsx";

/* SEGURIDAD */
import Seguridad from "./pages/seguridad/Seguridad.jsx";
import SeguridadUsuarios from "./pages/seguridad/SeguridadUsuarios.jsx";
import SeguridadFicha from "./pages/seguridad/SeguridadFicha.jsx";
import SeguridadAuditoria from "./pages/seguridad/SeguridadAuditoria.jsx";
import SeguridadLogs from "./pages/seguridad/SeguridadLogs.jsx";
import SeguridadRolEditor from "./pages/seguridad/SeguridadRolEditor.jsx";

/* EMPLEADOS */
import EmpleadosModulo2026 from "./pages/empleados/EmpleadosModulo2026.jsx";

export default function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* REDIRECCIÓN INICIAL */}
      <Route path="/" element={<Navigate to="/panel/empleados" replace />} />

      {/* RUTAS CON LAYOUT */}
      <Route element={<Layout />}>
        {/* EMPLEADOS */}
        <Route path="/panel/empleados" element={<EmpleadosModulo2026 />} />

        {/* CTN */}
        <Route path="/ctn" element={<Ctn />} />
        <Route path="/ctn/:id" element={<CtnDetallePage />} />

        {/* LOGS */}
        <Route path="/logs" element={<Logs />} />

        {/* HERRAMIENTAS */}
        <Route path="/herramientas" element={<Herramientas />} />
        <Route path="/herramientas/importar-ctn" element={<ImportarCTN />} />
        <Route path="/herramientas/utilidades" element={<Utilidades />} />

        {/* SEGURIDAD */}
        <Route path="/seguridad" element={<Seguridad />} />
        <Route path="/seguridad/usuarios" element={<SeguridadUsuarios />} />
        <Route path="/seguridad/ficha/:id" element={<SeguridadFicha />} />
        <Route path="/seguridad/auditoria" element={<SeguridadAuditoria />} />
        <Route path="/seguridad/logs" element={<SeguridadLogs />} />
        <Route path="/seguridad/roles/editor" element={<SeguridadRolEditor />} />
      </Route>
    </Routes>
  );
}
