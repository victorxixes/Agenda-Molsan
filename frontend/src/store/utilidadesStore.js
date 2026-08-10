
import { create } from "zustand";
import { utilidadesAPI } from "../api/utilidades";
import { crearLog } from "../lib/log";
import { useAuthStore } from "../store/authStore";

export const useUtilidadesStore = create((set) => ({
  resultado: null,
  loading: false,

  importarCTN: async (file) => {
    set({ loading: true });
    const data = await utilidadesAPI.importarCTN(file);

    await crearLog(
      "utilidades",
      "importar_ctn",
      "Importación de CTN ejecutada",
      data
    );

    set({ resultado: data, loading: false });
  },

  crearNoticia: async (titulo, descripcion) => {
    set({ loading: true });

    const { user } = useAuthStore.getState();

    const payload = {
      titulo,
      descripcion,
      usuario_id: user.id
    };

    const data = await utilidadesAPI.crearNoticia(payload);

    await crearLog(
      "utilidades",
      "crear_noticia",
      `Noticia creada desde utilidades: ${titulo}`,
      data
    );

    set({ resultado: data, loading: false });
  },

  subirDocumento: async (titulo, concepto, archivo) => {
    set({ loading: true });

    const { user } = useAuthStore.getState();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("concepto", concepto);
    formData.append("fichero", archivo);
    formData.append("usuario_id", user.id);

    const data = await utilidadesAPI.subirDocumento(formData);

    await crearLog(
      "utilidades",
      "subir_documento",
      `Documento subido desde utilidades: ${titulo}`,
      data
    );

    set({ resultado: data, loading: false });
  },
}));
