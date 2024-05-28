import React from "react";
import "../Styles/Modal.css"; // Import CSS for modal

const Modal = ({ show, onClose, contactDetails }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Succesfully sent on your email</h2>
        <h2>Contact Details</h2>
        <p>Name: {contactDetails.name}</p>
        <p>Email: {contactDetails.email}</p>
        <p>Phone: {contactDetails.phone}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
