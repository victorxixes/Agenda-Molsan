import React from "react";
import "../../css/modals.css";

export default function ModalConfirm({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-window">

        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer gap-3">
          <button className="btn-sj-secondary" onClick={onCancel}>
            No
          </button>

          <button className="btn-sj" onClick={onConfirm}>
            Sí
          </button>
        </div>

      </div>
    </div>
  );
}
