import React from "react";
import AgendaCitaForm from "../../pages/agenda/AgendaCitaForm";

export default function ModalCita({ fecha, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <AgendaCitaForm fecha={fecha} />
      </div>
    </div>
  );
}
