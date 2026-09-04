import { useEffect, useState } from "react";
import { useMensajesStore } from "../../store/mensajesStore";
import { useMensajesWS } from "../../hooks/useMensajesWS";

export default function Mensajes({ usuarioId }) {
  const [otroId, setOtroId] = useState(null);

  const { mensajes, conectados, cargarConversacion, enviarMensajeREST } =
    useMensajesStore();

  useMensajesWS(usuarioId, otroId);

  useEffect(() => {
    if (otroId) cargarConversacion(usuarioId, otroId);
  }, [otroId]);

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {/* Lista de empleados conectados */}
      <div className="border p-4">
        <h2 className="font-bold mb-2">Conectados</h2>
        {conectados.map((id) => (
          <div
            key={id}
            className="cursor-pointer hover:bg-gray-100 p-2"
            onClick={() => setOtroId(id)}
          >
            Usuario {id}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="col-span-2 border p-4">
        {otroId ? (
          <>
            <h2 className="font-bold mb-2">Chat con usuario {otroId}</h2>

            <div className="h-[400px] overflow-y-auto border p-2 mb-4">
              {mensajes.map((m) => (
                <div
                  key={m.id}
                  className={`p-2 my-1 rounded ${
                    m.remitente_id === usuarioId
                      ? "bg-blue-100 text-right"
                      : "bg-gray-100"
                  }`}
                >
                  {m.contenido && <p>{m.contenido}</p>}
                  {m.archivo_url && (
                    <a
                      href={m.archivo_url}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Archivo adjunto
                    </a>
                  )}
                  <small className="text-gray-500">{m.fecha}</small>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const contenido = e.target.mensaje.value;
                enviarMensajeREST({
                  remitente_id: usuarioId,
                  destinatario_id: otroId,
                  contenido,
                });
                e.target.reset();
              }}
            >
              <input
                name="mensaje"
                className="border p-2 w-full"
                placeholder="Escribe un mensaje…"
              />
            </form>
          </>
        ) : (
          <p>Selecciona un usuario para chatear.</p>
        )}
      </div>
    </div>
  );
}

