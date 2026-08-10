import React, { useEffect, useRef } from "react";
import MensajeListItem from "./MensajeListItem.jsx";
import GlassSectionTitle from "../ui/GlassSectionTitle.jsx";
import IconMensajes from "../icons/IconMensajes.jsx";

export default function Conversacion({ mensajes, usuarioActual }) {
  const bottomRef = useRef(null);

  // 🔥 Protección total
  const safe = Array.isArray(mensajes) ? mensajes : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safe]);

  return (
    <div className="space-y-4">
      <GlassSectionTitle
        icon={<IconMensajes size={26} />}
        title="Conversación"
      />

      <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
        {safe.map((m) => (
          <MensajeListItem
            key={m.id}
            mensaje={m}
            propio={m.remitente_id === usuarioActual}
          />
        ))}

        <div ref={bottomRef}></div>
      </div>
    </div>
  );
}
