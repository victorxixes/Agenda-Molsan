import { useState } from "react";

export default function Utilidades() {
  const [jsonPreview, setJsonPreview] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  /* ============================
     UTILIDAD 1 — Ping al backend
     ============================ */
  const checkServer = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/status");
      const data = await res.json();
      setServerStatus(data);
    } catch (err) {
      setServerStatus({ ok: false, error: "Servidor no responde" });
    }
  };

  /* ==========================================
     UTILIDAD 2 — Cargar JSON y mostrar preview
     ========================================== */
  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setJsonPreview(parsed);
      } catch {
        setJsonPreview({ error: "JSON inválido" });
      }
    };
    reader.readAsText(file);
  };

  /* ==========================================
     UTILIDAD 3 — Exportar datos a JSON (frontend)
     ========================================== */
  const exportJson = () => {
    if (!jsonPreview) return;

    const blob = new Blob([JSON.stringify(jsonPreview, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "utilidades_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-sj fade-in">

      {/* ============================
          TÍTULO
      ============================ */}
      <div className="card-sj hover-elevate">
        <h1>Herramientas · Utilidades SJ‑2026</h1>
        <p>Panel de utilidades internas del ERP.</p>
      </div>

      {/* ============================
          UTILIDAD 1 — Ping al servidor
      ============================ */}
      <div className="card-sj hover-elevate">
        <h2>Estado del servidor</h2>
        <button className="btn-sj hover-zoom" onClick={checkServer}>
          Comprobar servidor
        </button>

        {serverStatus && (
          <div className="card-sj hover-elevate" style={{ marginTop: "20px" }}>
            <strong>Respuesta:</strong>
            <pre>{JSON.stringify(serverStatus, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* ============================
          UTILIDAD 2 — Cargar JSON
      ============================ */}
      <div className="card-sj hover-elevate">
        <h2>Cargar archivo JSON</h2>

        <input
          type="file"
          accept="application/json"
          className="input-sj"
          onChange={handleJsonUpload}
        />

        {jsonPreview && (
          <div className="card-sj hover-elevate" style={{ marginTop: "20px" }}>
            <h3>Preview del JSON</h3>
            <pre>{JSON.stringify(jsonPreview, null, 2)}</pre>

            <button className="btn-sj-outline hover-zoom" onClick={exportJson}>
              Exportar JSON
            </button>
          </div>
        )}
      </div>

      {/* ============================
          UTILIDAD 3 — Acciones rápidas
      ============================ */}
      <div className="card-sj hover-elevate">
        <h2>Acciones rápidas</h2>

        <div className="grid-sj grid-3">
          <button className="btn-sj hover-zoom">Limpiar caché local</button>
          <button className="btn-sj hover-zoom">Reiniciar sesión</button>
          <button className="btn-sj hover-zoom">Descargar logs locales</button>
        </div>
      </div>
    </div>
  );
}

