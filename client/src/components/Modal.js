import React from "react";

const Modal = ({ isOpen, matrix, onClose, onSave, type }) => {
  if (!isOpen) return null;

  let title, text, buttonText;
  switch (type) {
    case "setActive":
      title = `Set ${matrix} as active`;
      text = "Do you want to set this matrix as currently active?";
      buttonText = "Set Active";
      break;
    case "setDefault":
      title = `Set ${matrix} as default`;
      text = "Do you want to set this matrix as the default?";
      buttonText = "Set Default";
      break;
    case "delete":
      title = `Delete ${matrix}`;
      text = "Do you want to delete this Matrix";
      buttonText = "Delete";
      break;
    case "setInactive":
      title = `Set ${matrix} inactive`;
      text = "Do you want to set this Matrix inactive? The Default Matrix will be played.";
      buttonText = "Set Inactive";
      break;
  }

  return (
    <div className="modal show" style={{ display: "block" }} aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{text}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={onSave}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
