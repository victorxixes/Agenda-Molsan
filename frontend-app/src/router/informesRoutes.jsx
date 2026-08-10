import React from "react";
import { Route } from "react-router-dom";
import InformesAgendaPage from "../pages/informes/InformesAgendaPage";
import InformesApoderadosPage from "../pages/informes/InformesApoderadosPage";
import InformesZonasPage from "../pages/informes/InformesZonasPage";

export const informesRoutes = (
  <>
    <Route path="/informes/agenda" element={<InformesAgendaPage />} />
    <Route path="/informes/apoderados" element={<InformesApoderadosPage />} />
    <Route path="/informes/zonas" element={<InformesZonasPage />} />
  </>
);
