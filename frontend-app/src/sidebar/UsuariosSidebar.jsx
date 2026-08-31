import React, { useEffect } from "react";
import { useMensajesStore } from "../store/mensajesStore";
import { useAuthStore } from "../store/authStore";

export default function UsuariosSidebar({ seleccionar }) {
  const { conectados, cargarConectados } = useMensajesStore();
  const { user } = useAuthStore();

  // Actualizar lista de conectados cada 5 segundos
  useEffect(() => {
    cargarConectados();
    const interval = setInterval(cargarConectados, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-72 bg-[#0A2E5C] text-white p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Usuarios registrados</h2>

      <div className="space-y-3 overflow-y-auto">
        {Array.isArray(conectados) && conectados.length > 0 ? (
          conectados.map((u) => (
            <div
              key={u.id}
              onClick={() => seleccionar(u.id)}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#0D3A73]"
            >
              {/* Avatar redondo */}
              <img
                src={u.foto ||`${import.meta.env.VITE_API_URL}/fotos/default-avatar.png`}
                alt={u.nombre}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />

              <div className="flex flex-col">
                <span className="font-medium">{u.nombre}</span>

                {/* Indicador verde/rojo */}
                <span className="flex items-center gap-1 text-sm">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      u.logeado ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></span>
                  {u.logeado ? "Conectado" : "Desconectado"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/70">No hay usuarios conectados.</p>
        )}
      </div>
    </div>
  );
}
