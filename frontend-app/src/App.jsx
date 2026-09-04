import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

/* CTN */
import Ctn from "./pages/ctn/Ctn.jsx";
import CtnDetallePage from "./pages/ctn/CtnDetallePage.jsx";

/* LOGS */
import Logs from "./pages/logs/Logs.jsx";

/* HERRAMIENTAS */
import Herramientas from "./pages/herramientas/Herramientas.jsx";
import ImportarCTN from "./pages/herramientas/ImportarCTN.jsx";
import Utilidades from "./pages/herramientas/Utilidades.jsx";

/* SEGURIDAD */
import Seguridad from "./pages/seguridad/Seguridad.jsx";

/* EMPLEADOS */
import EmpleadosModulo2026 from "./pages/empleados/EmpleadosModulo2026.jsx";

export default function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* REDIRECCIÓN INICIAL */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* MÓDULOS */}
      <Route path="/ctn" element={<Ctn />} />
      <Route path="/ctn/:id" element={<CtnDetallePage />} />

      <Route path="/logs" element={<Logs />} />

      <Route path="/herramientas" element={<Herramientas />} />
      <Route path="/herramientas/importar-ctn" element={<ImportarCTN />} />
      <Route path="/herramientas/utilidades" element={<Utilidades />} />

      <Route path="/seguridad" element={<Seguridad />} />

      <Route path="/panel/empleados" element={<EmpleadosModulo2026 />} />
    </Routes>
  );
}
