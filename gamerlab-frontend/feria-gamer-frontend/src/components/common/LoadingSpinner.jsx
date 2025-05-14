import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = ({ text = 'Cargando...' }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" role="status" variant="primary" className="me-2" />
      <span>{text}</span>
    </Container>
  );
};

export default LoadingSpinner;