export default function MensajesHeader({ otroId, conectados }) {
  const usuario = conectados.find((x) => x.id === otroId);

  return (
    <div className="flex items-center gap-3 border-b pb-3 mb-3">
      
      {/* Foto */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden border bg-gray-200">
        <img
          src={`${import.meta.env.VITE_API_URL}${usuario?.foto}`}
          className="w-full h-full object-cover"
        />

        {/* Estado online */}
        {usuario && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full"></span>
        )}
      </div>

      {/* Nombre + estado */}
      <div>
        <div className="font-semibold text-gray-900 text-lg">
          {usuario?.nombre} {usuario?.apellidos}
        </div>

        <div className="text-sm text-gray-500">
          {usuario ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
}
