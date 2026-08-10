import React from "react";
import "../../css/modals.css";

export default function ModalForm({ open, title, children, onSubmit, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-window">

        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modal-body">
            {children}
          </div>

          <div className="modal-footer gap-3">
            <button type="button" className="btn-sj-secondary" onClick={onCancel}>
              Cancelar
            </button>

            <button type="submit" className="btn-sj">
              Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
