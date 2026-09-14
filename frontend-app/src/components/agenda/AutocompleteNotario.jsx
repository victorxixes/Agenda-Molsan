import { useEffect, useState } from "react";
import { listarNotarios } from "../../api/notarios";

export default function AutocompleteNotario({ value, onSelect }) {
  const [notarios, setNotarios] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    listarNotarios().then((res) => {
      setNotarios(res.data);
    });
  }, []);

  const filtrados = notarios.filter((n) =>
    `${n.nombre} ${n.apellidos} ${n.municipio} ${n.provincia}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const seleccionar = (n) => {
    setQuery(`${n.nombre} ${n.apellidos}`);
    setOpen(false);

    // Construcción del notario para ModalNuevaCita
    const notarioCompleto = {
      id: n.id,
      nombre: n.nombre,
      apellidos: n.apellidos,
      telefono: n.telefono || "",
      direccion: `${n.municipio}, ${n.provincia}`,
      vc: n.vc,
      apoderado_id: n.apoderado_id || null,
      apoderado_s: n.apoderado_s || "",
      observacion: n.observacion || "",
      tipo_firma: n.vc === "SI" ? "VideoConferencia" : "Presencial",
    };

    onSelect(notarioCompleto);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full border rounded px-2 py-1"
        placeholder="Buscar notario..."
        value={value ? `${value.nombre} ${value.apellidos}` : query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />

      {open && (
        <div className="absolute left-0 right-0 bg-white border rounded shadow max-h-60 overflow-auto z-10">
          {filtrados.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No hay resultados
            </div>
          ) : (
            filtrados.map((n) => (
              <div
                key={n.id}
                onClick={() => seleccionar(n)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              >
                {n.nombre} {n.apellidos} — {n.municipio}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
