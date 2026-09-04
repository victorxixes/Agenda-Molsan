import { useIntranet } from "../../hooks/useIntranet";

export default function NoticiasFeed() {
  const { noticias, eliminarNoticia } = useIntranet();

  return (
    <div className="space-y-4">
      {noticias.map((n) => (
        <div key={n.id} className="border p-4 rounded bg-white shadow">
          <h3 className="font-bold text-lg">{n.titulo}</h3>
          <p className="text-gray-700">{n.descripcion}</p>
          <small className="text-gray-500">
            {new Date(n.fecha_publicacion).toLocaleString()}
          </small>

          <button
            className="text-red-600 mt-2"
            onClick={() => eliminarNoticia(n.id)}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
