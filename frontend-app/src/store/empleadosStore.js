import { create } from "zustand";
import { empleadosAPI } from "../api/empleados";
import { crearLog } from "../lib/log";

export const useEmpleadosStore = create((set, get) => ({
  // ---------------------------------------------------------
  // ESTADO
  // ---------------------------------------------------------
  empleados: [],
  empleadoActual: null,
  loading: false,
  error: null,

  // Empleados conectados (WebSocket)
  conectados: [],

  // ---------------------------------------------------------
  // WEBSOCKET: CONECTADOS
  // ---------------------------------------------------------
  marcarConectado: (id) =>
    set((state) => ({
      conectados: [...new Set([...state.conectados, id])]
    })),

  marcarDesconectado: (id) =>
    set((state) => ({
      conectados: state.conectados.filter((x) => x !== id)
    })),

  // ---------------------------------------------------------
  // LISTAR EMPLEADOS
  // ---------------------------------------------------------
  cargarEmpleados: async () => {
    try {
      set({ loading: true, error: null });
      const data = await empleadosAPI.listar();
      set({
        empleados: Array.isArray(data) ? data : [],
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: "Error cargando empleados" });
    }
  },

  // ---------------------------------------------------------
  // CARGAR EMPLEADO
  // ---------------------------------------------------------
  cargarEmpleado: async (id) => {
    try {
      set({ loading: true, empleadoActual: null, error: null });
      const data = await empleadosAPI.obtener(id);
      set({ empleadoActual: data, loading: false });
    } catch (err) {
      set({ loading: false, error: "Error cargando empleado" });
    }
  },

  // ---------------------------------------------------------
  // BUSCAR EMPLEADOS
  // ---------------------------------------------------------
  buscarEmpleados: async (filtros) => {
    const params = new URLSearchParams();

    if (filtros.id) params.append("id", filtros.id);
    if (filtros.dni) params.append("dni", filtros.dni);
    if (filtros.q) params.append("q", filtros.q);
    if (filtros.activo !== null) params.append("activo", filtros.activo);

    const API = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API}/empleados/search?${params.toString()}`);
    const data = await res.json();

    set({ empleados: data.items });
  },

  // ---------------------------------------------------------
  // CREAR EMPLEADO
  // ---------------------------------------------------------
  crearEmpleado: async (data) => {
    try {
      const res = await empleadosAPI.crear(data);

      await crearLog(
        "empleados",
        "crear",
        `Empleado creado: ${res.nombre} ${res.apellidos}`,
        res
      );

      await get().cargarEmpleados();
    } catch (err) {
      set({ error: "Error creando empleado" });
    }
  },

  // ---------------------------------------------------------
  // ACTUALIZAR EMPLEADO
  // ---------------------------------------------------------
  actualizarEmpleado: async (id, data) => {
    try {
      const res = await empleadosAPI.actualizar(id, data);

      await crearLog(
        "empleados",
        "editar",
        `Empleado editado: ${res.nombre} ${res.apellidos}`,
        res
      );

      await get().cargarEmpleados();
      await get().cargarEmpleado(id);
    } catch (err) {
      set({ error: "Error actualizando empleado" });
    }
  },

  // ---------------------------------------------------------
  // ELIMINAR EMPLEADO
  // ---------------------------------------------------------
  eliminarEmpleado: async (id) => {
    try {
      await empleadosAPI.eliminar(id);

      await crearLog(
        "empleados",
        "eliminar",
        `Empleado eliminado: ID ${id}`,
        { id }
      );

      await get().cargarEmpleados();
    } catch (err) {
      set({ error: "Error eliminando empleado" });
    }
  },

  // ---------------------------------------------------------
  // ACTIVAR / DESACTIVAR EMPLEADO
  // ---------------------------------------------------------
  toggleActivo: async (empleado) => {
    try {
      const nuevoEstado = !empleado.activo;

      const res = await empleadosAPI.actualizar(empleado.id, {
        ...empleado,
        activo: nuevoEstado,
      });

      await crearLog(
        "empleados",
        nuevoEstado ? "activar" : "inhabilitar",
        `Empleado ${nuevoEstado ? "activado" : "desactivado"}: ${empleado.nombre} ${empleado.apellidos}`,
        res
      );

      await get().cargarEmpleado(empleado.id);
      await get().cargarEmpleados();
    } catch (err) {
      set({ error: "Error cambiando estado del empleado" });
    }
  },

  // ---------------------------------------------------------
  // SUBIR FOTO
  // ---------------------------------------------------------
  subirFoto: async (id, archivo) => {
    try {
      const formData = new FormData();
      formData.append("archivo", archivo);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/empleados/${id}/foto`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (data.error) {
        set({ error: data.error });
        return;
      }

      await crearLog(
        "empleados",
        "foto",
        `Foto actualizada para empleado ID ${id}`,
        data
      );

      await get().cargarEmpleado(id);
      await get().cargarEmpleados();
    } catch (err) {
      set({ error: "Error subiendo foto" });
    }
  },

  // ---------------------------------------------------------
  // GUARDAR PERMISOS Y MÓDULOS VISIBLES
  // ---------------------------------------------------------
  guardarPermisos: async (id, modulos_visibles, permisos_modulo) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/empleados/${id}/permisos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modulos_visibles,
          permisos_modulo,
        }),
      });

      await crearLog(
        "empleados",
        "permisos",
        `Permisos actualizados para empleado ID ${id}`,
        { modulos_visibles, permisos_modulo }
      );

      await get().cargarEmpleado(id);
    } catch (err) {
      set({ error: "Error guardando permisos" });
    }
  },
}));
