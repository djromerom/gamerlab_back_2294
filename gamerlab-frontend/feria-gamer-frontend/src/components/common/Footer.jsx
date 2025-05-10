import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Feria Gamer</h5>
            <p className="mb-0">Sistema de gestión para videojuegos académicos</p>
            <small>&copy; {new Date().getFullYear()} Universidad del Norte</small>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">Desarrollado para la clase de Diseño de Software</p>
            <small>Profesor: Daniel José Romero Martínez</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;