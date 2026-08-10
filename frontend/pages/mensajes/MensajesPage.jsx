import React, { useEffect, useState } from "react";
import { useMensajesStore } from "../../store/mensajesStore";
import { useAuthStore } from "../../store/authStore";

import ListaUsuariosConectados from "../../components/mensajes/ListaUsuariosConectados.jsx";
import Conversacion from "../../components/mensajes/Conversacion.jsx";
import EnviarMensaje from "../../components/mensajes/EnviarMensaje.jsx";

export default function MensajesPage() {
  const { user } = useAuthStore();
  const usuarioId = user?.id;

  const {
    conectados,
    conversacion,
    cargarConectados,
    cargarConversacion,
    enviarMensaje,
    marcarLeido,
  } = useMensajesStore();

  const [destinatario, setDestinatario] = useState(null);

  useEffect(() => {
    cargarConectados();
  }, []);

  useEffect(() => {
    if (usuarioId && destinatario) {
      cargarConversacion(usuarioId, destinatario);
      marcarLeido(destinatario, usuarioId);
    }
  }, [usuarioId, destinatario]);

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      <ListaUsuariosConectados
        usuarios={conectados}
        seleccionar={setDestinatario}
      />

      <div className="col-span-2 space-y-4">
        <Conversacion mensajes={conversacion} usuarioActual={usuarioId} />

        {destinatario && (
          <EnviarMensaje
            remitente={usuarioId}
            destinatario={destinatario}
            enviar={enviarMensaje}
          />
        )}
      </div>
    </div>
  );
}
