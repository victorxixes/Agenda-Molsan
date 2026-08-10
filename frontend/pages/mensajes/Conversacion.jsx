import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useMensajesStore } from "../../store/mensajesStore";
import { useAuthStore } from "../../store/authStore";

import ListaUsuariosConectados from "../../components/mensajes/ListaUsuariosConectados";
import Conversacion from "../../components/mensajes/Conversacion";
import EnviarMensaje from "../../components/mensajes/EnviarMensaje";

import GlassSectionTitle from "../../components/ui/GlassSectionTitle";
import IconMensajes from "../../components/icons/IconMensajes";

export default function ConversacionPage() {
  const { id: destinatarioId } = useParams();
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

  useEffect(() => {
    cargarConectados();
  }, []);

  useEffect(() => {
    if (usuarioId && destinatarioId) {
      cargarConversacion(usuarioId, destinatarioId);
      marcarLeido(destinatarioId, usuarioId);
    }
  }, [usuarioId, destinatarioId]);

  return (
    <div className="p-4 grid grid-cols-3 gap-4">

      {/* LISTA DE USUARIOS */}
      <ListaUsuariosConectados
        usuarios={conectados}
        seleccionar={() => {}}
      />

      {/* CONVERSACIÓN */}
      <div className="col-span-2 space-y-4">
        <GlassSectionTitle
          icon={<IconMensajes size={26} />}
          title="Conversación"
        />

        <Conversacion mensajes={conversacion} usuarioActual={usuarioId} />

        {/* ENVIAR MENSAJE */}
        {destinatarioId && (
          <EnviarMensaje
            remitente={usuarioId}
            destinatario={destinatarioId}
            enviar={enviarMensaje}
          />
        )}
      </div>
    </div>
  );
}
