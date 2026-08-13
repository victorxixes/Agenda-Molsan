import { create } from "zustand";
import { intranetAPI } from "../api/intranet";
import { crearLog } from "../lib/log";
import { useAuthStore } from "../store/authStore";

export const useIntranetStore = create((set, get) => ({
  // ---------------------------------------------------------
  // ESTADO
  // ---------------------------------------------------------
  noticias: [],
  documentos: [],
  notificaciones: [],
  loading: false,

  // ---------------------------------------------------------
  // NOTIFICACIONES (WebSocket)
  // ---------------------------------------------------------
  agregarNotificacion: (notif) =>
    set((state) => ({
      notificaciones: [notif, ...state.notificaciones]
    })),

  // ---------------------------------------------------------
  // NOTICIAS
  // ---------------------------------------------------------
  cargarNoticias: async () => {
    set({ loading: true });
    const data = await intranetAPI.listarNoticias();
    const safe = Array.isArray(data) ? data : [];
    set({ noticias: safe, loading: false });
  },

  crearNoticia: async (form) => {
    const { user } = useAuthStore.getState();

    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      usuario_id: user.id
    };

    const res = await intranetAPI.crearNoticia(payload);

    await crearLog(
      "intranet",
      "crear_noticia",
      `Noticia creada por ${user.nombre}: ${form.titulo}`,
      res
    );

    await get().cargarNoticias();
  },

  eliminarNoticia: async (id) => {
    const { user } = useAuthStore.getState();

    await intranetAPI.eliminarNoticia(id);

    await crearLog(
      "intranet",
      "eliminar_noticia",
      `Noticia eliminada por ${user.nombre}`,
      { noticia_id: id }
    );

    await get().cargarNoticias();
  },

  actualizarNoticia: async (noticia) => {
    const { user } = useAuthStore.getState();

    const payload = {
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      usuario_id: user.id
    };

    const res = await intranetAPI.editarNoticia(noticia.id, payload);

    await crearLog(
      "intranet",
      "editar_noticia",
      `Noticia editada por ${user.nombre}: ${noticia.titulo}`,
      res
    );

    set((state) => ({
      noticias: state.noticias.map((n) =>
        n.id === noticia.id ? res : n
      )
    }));
  },

  // ---------------------------------------------------------
  // DOCUMENTOS
  // ---------------------------------------------------------
  cargarDocumentos: async () => {
    set({ loading: true });
    const data = await intranetAPI.listarDocumentos();
    const safe = Array.isArray(data) ? data : [];
    set({ documentos: safe, loading: false });
  },

  subirDocumento: async (titulo, concepto, archivo) => {
    const { user } = useAuthStore.getState();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("concepto", concepto);
    formData.append("fichero", archivo);
    formData.append("usuario_id", user.id);

    const res = await intranetAPI.crearDocumento(formData);

    await crearLog(
      "intranet",
      "subir_documento",
      `Documento subido por ${user.nombre}: ${titulo}`,
      res
    );

    await get().cargarDocumentos();
  },

  eliminarDocumento: async (id) => {
    const { user } = useAuthStore.getState();

    await intranetAPI.eliminarDocumento(id);

    await crearLog(
      "intranet",
      "eliminar_documento",
      `Documento eliminado por ${user.nombre}`,
      { documento_id: id }
    );

    await get().cargarDocumentos();
  },

  actualizarDocumento: async (doc) => {
    const { user } = useAuthStore.getState();

    const payload = {
      titulo: doc.titulo,
      concepto: doc.concepto,
      fichero: doc.fichero,
      usuario_id: user.id
    };

    const res = await intranetAPI.editarDocumento(doc.id, payload);

    await crearLog(
      "intranet",
      "editar_documento",
      `Documento editado por ${user.nombre}: ${doc.titulo}`,
      res
    );

    set((state) => ({
      documentos: state.documentos.map((d) =>
        d.id === doc.id ? res : d
      )
    }));
  },

  descargarDocumento: async (id) => {
    return await intranetAPI.descargarDocumento(id);
  }
}));
