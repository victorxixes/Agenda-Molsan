export default function MensajeBubble({ mensaje, usuarioId, avatarUrl, online }) {
  const propio = mensaje.remitente_id === usuarioId;

  const esImagen = mensaje.archivo_url?.match(/\.(jpg|jpeg|png|gif)$/i);
  const esPDF = mensaje.archivo_url?.match(/\.pdf$/i);

  const archivoFullUrl = mensaje.archivo_url
    ? `${import.meta.env.VITE_API_URL}${mensaje.archivo_url}`
    : null;

  return (
    <div className={`flex items-start gap-2 my-2 ${propio ? "justify-end" : ""}`}>
      {!propio && (
        <div className="relative w-8 h-8 rounded-full overflow-hidden border bg-gray-200">
          <img
            src={avatarUrl || "/no-foto.png"}
            className="w-full h-full object-cover"
          />
          {online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
          )}
        </div>
      )}

      <div
        className={`p-2 rounded max-w-[70%] ${
          propio ? "bg-blue-100 text-right" : "bg-gray-100"
        }`}
      >
        {mensaje.contenido && <p>{mensaje.contenido}</p>}

        {esImagen && archivoFullUrl && (
          <img
            src={archivoFullUrl}
            className="mt-2 rounded max-h-48 border"
          />
        )}

        {esPDF && archivoFullUrl && (
          <a
            href={archivoFullUrl}
            target="_blank"
            className="text-blue-600 underline block mt-2"
          >
            Ver PDF
          </a>
        )}

        {!esImagen && !esPDF && archivoFullUrl && (
          <a
            href={archivoFullUrl}
            target="_blank"
            className="text-blue-600 underline block mt-2"
          >
            Archivo adjunto
          </a>
        )}

        <small className="text-gray-500 text-xs block mt-1">
          {mensaje.fecha}
        </small>
      </div>

      {propio && (
        <div className="w-8 h-8 rounded-full overflow-hidden border bg-blue-200">
          <img
            src={avatarUrl || "/no-foto.png"}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
