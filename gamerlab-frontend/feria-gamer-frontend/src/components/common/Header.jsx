import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Feria Gamer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/equipos"
              active={location.pathname.startsWith('/equipos')}
            >
              Equipos
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/videojuegos"
              active={location.pathname.startsWith('/videojuegos')}
            >
              Videojuegos
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/jurados"
              active={location.pathname.startsWith('/jurados')}
            >
              Jurados
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;