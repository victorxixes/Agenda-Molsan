import { create } from "zustand";
import { empleadosAPI } from "../api/empleados";
import { crearLog } from "../lib/log";

export const useEmpleadosStore = create((set, get) => ({
  empleados: [],
  empleadoActual: null,
  loading: false,
  error: null,

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
      if (empleado.activo) {
        await empleadosAPI.inhabilitar(empleado.id);

        await crearLog(
          "empleados",
          "inhabilitar",
          `Empleado desactivado: ${empleado.nombre} ${empleado.apellidos}`,
          empleado
        );
      } else {
        await empleadosAPI.actualizar(empleado.id, {
          ...empleado,
          activo: true,
        });

        await crearLog(
          "empleados",
          "activar",
          `Empleado activado: ${empleado.nombre} ${empleado.apellidos}`,
          empleado
        );
      }

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
    } catch (err) {
      set({ error: "Error subiendo foto" });
    }
  },

  // ---------------------------------------------------------
  // CARGAR PERMISOS Y MÓDULOS VISIBLES
  // ---------------------------------------------------------
  cargarPermisos: async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/empleados/${id}/modulos`
      );
      const data = await res.json();
      return data;
    } catch (err) {
      set({ error: "Error cargando permisos" });
      return null;
    }
  },

  guardarPermisos: async (id, modulos, permisos) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/empleados/${id}/modulos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modulos),
      });

      await fetch(`${import.meta.env.VITE_API_URL}/empleados/${id}/permisos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(permisos),
      });

      await crearLog(
        "empleados",
        "permisos",
        `Permisos actualizados para empleado ID ${id}`,
        { modulos, permisos }
      );
    } catch (err) {
      set({ error: "Error guardando permisos" });
    }
  },
}));
