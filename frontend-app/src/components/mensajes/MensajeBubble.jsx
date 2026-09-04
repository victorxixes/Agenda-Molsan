export default function MensajeBubble({ mensaje, usuarioId }) {
  const propio = mensaje.remitente_id === usuarioId;

  return (
    <div
      className={`p-2 my-1 rounded ${
        propio ? "bg-blue-100 text-right" : "bg-gray-100"
      }`}
    >
      {mensaje.contenido && <p>{mensaje.contenido}</p>}
      {mensaje.archivo_url && (
        <a
          href={mensaje.archivo_url}
          target="_blank"
          className="text-blue-600 underline"
        >
          Archivo adjunto
        </a>
      )}
      <small className="text-gray-500">{mensaje.fecha}</small>
    </div>
  );
}

