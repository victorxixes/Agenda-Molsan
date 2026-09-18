const { token, authReady } = useAuthStore();

useEffect(() => {
  if (!authReady || !token) return;

  async function cargar() {
    try {
      setLoading(true);
      setError(null);

      const [resNoticias, resDocumentos] = await Promise.all([
        fetch(`${API}/noticias`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API}/documentos`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!resNoticias.ok || !resDocumentos.ok) {
        throw new Error("Error cargando datos de intranet");
      }

      const dataNoticias = await resNoticias.json();
      const dataDocumentos = await resDocumentos.json();

      setNoticias(dataNoticias || []);
      setDocumentos(dataDocumentos || []);
    } catch (e) {
      setError(e.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  cargar();
}, [token, authReady]);
