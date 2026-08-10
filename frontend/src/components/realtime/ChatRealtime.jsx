import React, { useEffect } from "react";
import { connectChat } from "../../realtime/chat";
import { useRealtimeStore } from "../../store/realtimeStore";
import { useAuthStore } from "../../store/authStore";

export default function ChatRealtime() {
  const { user } = useAuthStore();
  const { chat, pushChat } = useRealtimeStore();

  useEffect(() => {
    if (!user) return;
    const ws = connectChat(user.id, pushChat);
    return () => ws.close();
  }, [user]);

  return (
    <div className="p-3 border rounded bg-white">
      <h3 className="font-semibold mb-2">Chat en tiempo real</h3>

      <ul className="max-h-64 overflow-y-auto">
        {chat.map((m, i) => (
          <li key={i} className="border-b py-1">
            <strong>{m.remitente_id}</strong>: {m.mensaje}
          </li>
        ))}
      </ul>
    </div>
  );
}
