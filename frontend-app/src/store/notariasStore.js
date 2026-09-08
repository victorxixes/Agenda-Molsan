import { create } from "zustand";
import { obtenerNotarios } from "../api/agenda";

export const useNotariasStore = create((set) => ({
  notarios: [],
  cargando: false,

  cargarNotarios: async () => {
    set({ cargando: true });

    const res = await obtenerNotarios();
    const notarías = Array.isArray(res.data) ? res.data : [];

    // ⭐ Aquí cada notaría ES un notario
    const listaNotarios = notarías.map((n) => ({
      id: n.id,
      nombre: n.nombre,
      apellidos: n.apellidos || "",
      vc: n.vc || "",
      observacion: n.observacion || "",
      apoderado_id: n.apoderado_id || null,
    }));

    set({
      notarios: listaNotarios,
      cargando: false,
    });
  },
}));
