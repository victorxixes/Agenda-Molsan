import React from "react";
import "../../css/modals.css";

export default function Modal({ onClose, title, children }) {

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        
        {/* Header */}
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-sj" onClick={onClose}>
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
