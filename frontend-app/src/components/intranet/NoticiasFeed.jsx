import { useIntranet } from "../../hooks/useIntranet";

export default function NoticiasFeed() {
  const { noticias, eliminarNoticia } = useIntranet();

  return (
    <div className="space-y-4">
      {noticias.map((n) => (
        <div
          key={n.id}
          className="
            bg-white/10 backdrop-blur-xl border border-white/20
            rounded-2xl p-5 shadow-xl text-white space-y-2
          "
        >
          <h3 className="text-lg font-semibold drop-shadow">{n.titulo}</h3>

          <p className="text-white/80">{n.descripcion}</p>

          <small className="text-white/60 block">
            {new Date(n.fecha_publicacion).toLocaleString()}
          </small>

          <button
            className="
              mt-2 px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700
              text-white text-sm shadow-lg transition
            "
            onClick={() => eliminarNoticia(n.id)}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
