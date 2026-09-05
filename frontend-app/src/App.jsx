import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import RequireAuth from "./components/auth/RequireAuth";

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
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* RUTAS CON LAYOUT + PROTECCIÓN */}
      <Route element={<Layout />}>
        {/* EMPLEADOS */}
        <Route
          path="/panel/empleados"
          element={
            <RequireAuth>
              <EmpleadosModulo2026 />
            </RequireAuth>
          }
        />

        {/* CTN */}
        <Route
          path="/ctn"
          element={
            <RequireAuth>
              <Ctn />
            </RequireAuth>
          }
        />
        <Route
          path="/ctn/:id"
          element={
            <RequireAuth>
              <CtnDetallePage />
            </RequireAuth>
          }
        />

        {/* LOGS */}
        <Route
          path="/logs"
          element={
            <RequireAuth>
              <Logs />
            </RequireAuth>
          }
        />

        {/* HERRAMIENTAS */}
        <Route
          path="/herramientas"
          element={
            <RequireAuth>
              <Herramientas />
            </RequireAuth>
          }
        />
        <Route
          path="/herramientas/importar-ctn"
          element={
            <RequireAuth>
              <ImportarCTN />
            </RequireAuth>
          }
        />
        <Route
          path="/herramientas/utilidades"
          element={
            <RequireAuth>
              <Utilidades />
            </RequireAuth>
          }
        />

        {/* SEGURIDAD */}
        <Route
          path="/seguridad"
          element={
            <RequireAuth>
              <Seguridad />
            </RequireAuth>
          }
        />
        <Route
          path="/seguridad/usuarios"
          element={
            <RequireAuth>
              <SeguridadUsuarios />
            </RequireAuth>
          }
        />
        <Route
          path="/seguridad/ficha/:id"
          element={
            <RequireAuth>
              <SeguridadFicha />
            </RequireAuth>
          }
        />
        <Route
          path="/seguridad/auditoria"
          element={
            <RequireAuth>
              <SeguridadAuditoria />
            </RequireAuth>
          }
        />
        <Route
          path="/seguridad/logs"
          element={
            <RequireAuth>
              <SeguridadLogs />
            </RequireAuth>
          }
        />
        <Route
          path="/seguridad/roles/editor"
          element={
            <RequireAuth>
              <SeguridadRolEditor />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}
