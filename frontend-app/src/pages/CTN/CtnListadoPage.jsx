import { useEffect, useState } from "react";
import { useCtn } from "../../hooks/useCtn";
import { Link } from "react-router-dom";

export default function CtnListadoPage() {
  const { notarias, cargarNotarias, loading } = useCtn();
  const [search, setSearch] = useState("");

  useEffect(() => {
    cargarNotarias();
  }, []);

  return (
    <div className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Buscar notaría…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          cargarNotarias(e.target.value);
        }}
      />

      {loading ? (
        <p>Cargando notarías…</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Localidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {notarias.map((n) => (
              <tr key={n.id} className="border-b">
                <td>{n.id}</td>
                <td>{n.nombre}</td>
                <td>{n.direccion}</td>
                <td>{n.localidad}</td>
                <td>
                  <Link
                    to={`/ctn/${n.id}`}
                    className="text-blue-600 underline"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
