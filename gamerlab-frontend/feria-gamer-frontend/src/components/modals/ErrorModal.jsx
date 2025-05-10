import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorModal = ({ 
  show, 
  onHide, 
  title = 'Error', 
  message = 'Ha ocurrido un error inesperado.'
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;