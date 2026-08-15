import React from "react";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    console.log("WS_URL:", import.meta.env.VITE_WS_URL);
  }, []);

  return (
    <div>
      {/* tu app */}
    </div>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "./router/RequireAuth.jsx";
import Layout from "./layout/Layout.jsx";

import MiPerfil from "./pages/perfil/MiPerfil";

// LOGIN
import LoginPage from "./pages/LoginPage.jsx";

// DASHBOARD
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";

// AGENDA (nuevo módulo)
import AgendaPage from "./pages/agenda/AgendaPage.jsx";

// INTRANET
import IntranetPage from "./pages/intranet/IntranetPage.jsx";

// MENSAJES
import MensajesPage from "./pages/mensajes/MensajesPage.jsx";
import ConversacionPage from "./pages/mensajes/Conversacion.jsx";
import MensajesChat from "./pages/mensajes/MensajesChat.jsx";   // ⭐ NUEVO CHAT

// EMPLEADOS
import EmpleadosList from "./pages/empleados/EmpleadosList.jsx";
import EmpleadoDetalle from "./pages/empleados/EmpleadoDetalle.jsx";
import EmpleadoForm from "./pages/empleados/EmpleadoForm.jsx";

// CTN
import CTNList from "./pages/ctn/CTNList.jsx";
import CTNForm from "./pages/ctn/CTNForm.jsx";
import CTNDetalle from "./pages/ctn/CTNDetalle.jsx";
import CTNImportarExcel from "./pages/ctn/CTNImportarExcel.jsx";

// SEGURIDAD
import SeguridadPage from "./pages/seguridad/SeguridadPage.jsx";
import RolesList from "./pages/seguridad/RolesList.jsx";
import RolForm from "./pages/seguridad/RolForm.jsx";
import AuditoriaPage from "./pages/auditoria/AuditoriaPage.jsx";
import LogsPage from "./pages/logs/LogsPage.jsx";

// UTILIDADES
import UtilidadesPage from "./pages/utilidades/UtilidadesPage.jsx";

export default function AppRouter() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* DASHBOARD */}
      <Route element={<RequireAuth modulo="dashboard" />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Route>

      {/* AGENDA */}
      <Route element={<RequireAuth modulo="agenda" />}>
        <Route element={<Layout />}>
          <Route path="/agenda" element={<AgendaPage />} />
        </Route>
      </Route>

      {/* INTRANET */}
      <Route element={<RequireAuth modulo="intranet" />}>
        <Route element={<Layout />}>
          <Route path="/intranet" element={<IntranetPage />} />
        </Route>
      </Route>

      {/* MENSAJES */}
      <Route element={<RequireAuth modulo="mensajes" />}>
        <Route element={<Layout />}>
          <Route path="/mensajes" element={<MensajesPage />} />
          <Route path="/mensajes/:id" element={<ConversacionPage />} />

          {/* ⭐ NUEVO CHAT MODERNO */}
          <Route path="/mensajes/chat" element={<MensajesChat />} />
        </Route>
      </Route>

      {/* EMPLEADOS */}
      <Route element={<RequireAuth modulo="empleados" />}>
        <Route element={<Layout />}>
          <Route path="/empleados" element={<EmpleadosList />} />
          <Route path="/empleados/nuevo" element={<EmpleadoForm />} />
          <Route path="/empleados/:empleadoId" element={<EmpleadoDetalle />} />
          <Route path="/perfil" element={<MiPerfil />} />
        </Route>
      </Route>

      {/* CTN */}
      <Route element={<RequireAuth modulo="ctn" />}>
        <Route element={<Layout />}>
          <Route path="/ctn" element={<CTNList />} />
          <Route path="/ctn/nueva" element={<CTNForm />} />
          <Route path="/ctn/importar" element={<CTNImportarExcel />} />
          <Route path="/ctn/:id" element={<CTNDetalle />} />
          <Route path="/ctn/:id/editar" element={<CTNForm />} />
        </Route>
      </Route>

      {/* SEGURIDAD */}
      <Route element={<RequireAuth modulo="seguridad" />}>
        <Route element={<Layout />}>
          <Route path="/seguridad" element={<SeguridadPage />} />
          <Route path="/seguridad/roles" element={<RolesList />} />
          <Route path="/seguridad/roles/nuevo" element={<RolForm />} />
          <Route path="/seguridad/roles/:id" element={<RolForm />} />
          <Route path="/seguridad/auditoria" element={<AuditoriaPage />} />
          <Route path="/seguridad/logs" element={<LogsPage />} />
        </Route>
      </Route>

      {/* UTILIDADES */}
      <Route element={<RequireAuth modulo="utilidades" />}>
        <Route element={<Layout />}>
          <Route path="/utilidades" element={<UtilidadesPage />} />
        </Route>
      </Route>

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
