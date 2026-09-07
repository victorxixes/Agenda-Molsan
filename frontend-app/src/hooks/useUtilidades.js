import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export function useUtilidades() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  // ---------------------------
  // IMPORTAR CTN
  // ---------------------------
  const importarCTN = async (file) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("fichero", file);

      const res = await axios.post(`${API}/utilidades/ctn/importar`, form);
      setResultado(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // CREAR NOTICIA
  // ---------------------------
  const crearNoticia = async (titulo, descripcion) => {
    const res = await axios.post(`${API}/intranet/noticias`, {
      titulo,
      descripcion
    });
    return res.data;
  };

  // ---------------------------
  // SUBIR DOCUMENTO
  // ---------------------------
  const subirDocumento = async (titulo, concepto, fichero) => {
    const form = new FormData();
    form.append("titulo", titulo);
    form.append("concepto", concepto);
    form.append("fichero", fichero);

    const res = await axios.post(`${API}/intranet/documentos`, form);
    return res.data;
  };

  return {
    loading,
    resultado,
    importarCTN,
    crearNoticia,
    subirDocumento
  };
}
