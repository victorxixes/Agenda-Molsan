import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Ctn from "./pages/ctn/Ctn";
import CtnDetallePage from "./pages/ctn/CtnDetallePage";
import Logs from "./pages/logs/Logs";
import Herramientas from "./pages/herramientas/Herramientas";
import ImportarCTN from "./pages/herramientas/ImportarCTN";
import Utilidades from "./pages/herramientas/Utilidades";
import Seguridad from "./pages/seguridad/Seguridad";
import EmpleadosModulo2026 from "./pages/Empleados/EmpleadosModulo2026";

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