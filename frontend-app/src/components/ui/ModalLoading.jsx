import React from "react";
import "../../css/modals.css";

export default function ModalLoading({ open, message = "Cargando..." }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-window modal-loading-center">

        <div className="spinner"></div>

        <p className="modal-loading-text">{message}</p>

      </div>
    </div>
  );
}
