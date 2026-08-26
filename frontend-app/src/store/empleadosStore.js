import { create } from "zustand";
import { empleadosAPI } from "../api/empleados";
import { crearLog } from "../lib/log";

export const useEmpleadosStore = create((set, get) => ({
  empleados: [],
  empleadoActual: null,
  loading: false,
  error: null,

  // ---------------------------------------------------------
  // REALTIME
  // ---------------------------------------------------------
  eventosRealtime: [],

  addRealtimeEmpleadoEvent: (ev) =>
    set((state) => ({
      eventosRealtime: [ev, ...state.eventosRealtime].slice(0, 200),
    })),

  procesarEventoRealtime: async (ev) => {
    const { tipo, payload } = ev;

    const refrescarLista = async () => {
      await get().cargarEmpleados();
    };

    const refrescarFicha = async () => {
      if (get().empleadoActual?.id === payload.id) {
        await get().cargarEmpleado(payload.id);
      }
    };

    switch (tipo) {
      case "empleado_creado":
        await refrescarLista();
        break;

      case "empleado_actualizado":
        await refrescarLista();
        await refrescarFicha();
        break;

      case "empleado_estado_cambiado":
        await refrescarLista();
        await refrescarFicha();
        break;

      case "empleado_rol_cambiado":
        await refrescarLista();
        await refrescarFicha();
        break;

      case "empleado_foto_actualizada":
        await refrescarFicha();
        break;

      case "empleado_modulos_actualizados":
        await refrescarFicha();
        break;

      case "empleado_permisos_actualizados":
        await refrescarFicha();
        break;

      default:
        break;
    }
  },

  // ---------------------------------------------------------
  // LISTAR EMPLEADOS
  // ---------------------------------------------------------
  cargarEmpleados: async () => {
    try {
      set({ loading: true, error: null });
      const data = await empleadosAPI.listar();
      set({ empleados: Array.isArray(data) ? data : [], loading: false });
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

      await get().cargarEmpleado(id);
      await get().cargarEmpleados();
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
      const res = await empleadosAPI.subirFoto(id, archivo);

      await crearLog(
        "empleados",
        "foto",
        `Foto actualizada para empleado ID ${id}`,
        res
      );

      await get().cargarEmpleado(id);
      await get().cargarEmpleados();
    } catch (err) {
      set({ error: "Error subiendo foto" });
    }
  },

  // ---------------------------------------------------------
  // GUARDAR MÓDULOS VISIBLES
  // ---------------------------------------------------------
  guardarModulos: async (id, modulos) => {
    try {
      await empleadosAPI.actualizarModulos(id, modulos);

      await crearLog(
        "empleados",
        "modulos",
        `Módulos visibles actualizados para empleado ID ${id}`,
        { modulos }
      );

      await get().cargarEmpleado(id);
    } catch (err) {
      set({ error: "Error guardando módulos visibles" });
    }
  },

  // ---------------------------------------------------------
  // GUARDAR PERMISOS POR MÓDULO
  // ---------------------------------------------------------
  guardarPermisos: async (id, permisos) => {
    try {
      await empleadosAPI.actualizarPermisos(id, permisos);

      await crearLog(
        "empleados",
        "permisos",
        `Permisos actualizados para empleado ID ${id}`,
        permisos
      );

      await get().cargarEmpleado(id);
    } catch (err) {
      set({ error: "Error guardando permisos" });
    }
  },
}));
