import { create } from "zustand";
import { seguridadAPI } from "../api/seguridad";
import { crearLog } from "../lib/log";

type SeguridadState = {
  roles: any[];
  permisosBase: any[];
  permisosRol: Record<string, string[]>;
  eventos: SeguridadEvent[];
  loading: boolean;
  addRealtimeEvent: (ev: SeguridadEvent) => void;
  // ...resto de acciones que ya tienes
};

export const useSeguridadStore = create<SeguridadState>((set, get) => ({
  roles: [],
  permisosBase: [],
  permisosRol: {},
  eventos: [],
  loading: false,

  addRealtimeEvent: (ev) =>
    set((state) => ({
      eventos: [ev, ...state.eventos].slice(0, 200),
    })),

  // resto de acciones (cargarRoles, crearRol, cargarEventos, etc.)
}));
