import React from "react";
import ReactDOM from "react-dom";
import { Modal, Button } from "react-bootstrap";

const DetailModal = ({ show, onClose, data }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Nombre:</strong> {data.name}</p>
        <p><strong>Especialidad:</strong> {data.specialty}</p>
        <p><strong>Años de experiencia:</strong> {data.years_experience}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>,
    document.body
  );
};

export default DetailModal;
