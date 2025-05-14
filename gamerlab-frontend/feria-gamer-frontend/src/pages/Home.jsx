import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllEquipos } from '../api/equipoApi';
import { getAllVideojuegos } from '../api/videojuegoApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [stats, setStats] = useState({
    equipos: 0,
    videojuegos: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [equiposData, videojuegosData] = await Promise.all([
          getAllEquipos(),
          getAllVideojuegos()
        ]);
        
        setStats({
          equipos: equiposData.length,
          videojuegos: videojuegosData.length,
          loading: false,
          error: null
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar estadísticas'
        }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return <LoadingSpinner text="Cargando datos..." />;
  }

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 mb-3">Feria Gamer</h1>
            <p className="lead">
              Plataforma para la gestión de videojuegos académicos y evaluación por jurados
            </p>
          </div>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100 shadow">
            <Card.Body>
              <h2 className="display-4 text-primary">{stats.equipos}</h2>
              <Card.Title>Equipos</Card.Title>
              <Card.Text>Equipos registrados en la plataforma</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100 shadow">
            <Card.Body>
              <h2 className="display-4 text-success">{stats.videojuegos}</h2>
              <Card.Title>Videojuegos</Card.Title>
              <Card.Text>Proyectos de videojuegos registrados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100 shadow">
            <Card.Body>
              <div className="py-3">
                <i className="bi bi-people-fill display-4 text-info"></i>
              </div>
              <Card.Title>Registro de Equipo</Card.Title>
              <Card.Text>Registra tu equipo para participar</Card.Text>
              <Link to="/equipos/crear">
                <Button variant="outline-primary">Registrar Equipo</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100 shadow">
            <Card.Body>
              <div className="py-3">
                <i className="bi bi-controller display-4 text-warning"></i>
              </div>
              <Card.Title>Registro de Videojuego</Card.Title>
              <Card.Text>Añade tu videojuego a la competencia</Card.Text>
              <Link to="/videojuegos/crear">
                <Button variant="outline-primary">Registrar Videojuego</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Equipos</Card.Title>
              <Card.Text>
                Gestiona equipos, registra integrantes y visualiza el estado de la inscripción.
              </Card.Text>
              <Link to="/equipos">
                <Button variant="primary">Ver Equipos</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Videojuegos</Card.Title>
              <Card.Text>
                Explora los videojuegos registrados y sus detalles.
              </Card.Text>
              <Link to="/videojuegos">
                <Button variant="primary">Ver Videojuegos</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Jurados</Card.Title>
              <Card.Text>
                Gestión de jurados y asignación de videojuegos para evaluación.
              </Card.Text>
              <Link to="/jurados">
                <Button variant="primary">Acceso Jurados</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;