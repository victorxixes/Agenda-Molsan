import React from "react";
import "../../css/modals.css";

export default function ModalAlert({ open, title, message, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-window">

        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button className="btn-sj" onClick={onClose}>
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
