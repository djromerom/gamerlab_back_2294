import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getVideojuegoById } from '../../api/videojuegoApi';
import { getEquipoById } from '../../api/equipoApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VideojuegoDetails = () => {
  const { id } = useParams();
  
  const [videojuego, setVideojuego] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const videojuegoData = await getVideojuegoById(parseInt(id));
        setVideojuego(videojuegoData);
        
        // Fetch related equipo
        if (videojuegoData.equipo_id) {
          const equipoData = await getEquipoById(videojuegoData.equipo_id);
          setEquipo(equipoData);
        }
        
        setError(null);
      } catch (err) {
        setError('Error al cargar el videojuego: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Cargando información del videojuego..." />;
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/videojuegos" variant="outline-primary">
          Volver a la lista de videojuegos
        </Button>
      </Container>
    );
  }

  if (!videojuego) {
    return (
      <Container className="py-4">
        <Alert variant="warning">Videojuego no encontrado</Alert>
        <Button as={Link} to="/videojuegos" variant="outline-primary">
          Volver a la lista de videojuegos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">{videojuego.nombre_videojuego}</h1>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Descripción</Card.Title>
              <Card.Text>{videojuego.descripcion}</Card.Text>
            </Card.Body>
          </Card>
          
          {equipo && (
            <Card className="mb-4">
              <Card.Header>Información del Equipo</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={equipo.url_logo ? 8 : 12}>
                    <h5>{equipo.nombre_equipo}</h5>
                    <p><strong>Estado:</strong> {equipo.estado.replace('_', ' ')}</p>
                    <p><strong>Integrantes:</strong> {equipo.estudiantes?.length || 0}</p>
                    <Button 
                      as={Link} 
                      to={`/equipos/${equipo.id}`} 
                      variant="outline-primary"
                    >
                      Ver Detalles del Equipo
                    </Button>
                  </Col>
                  
                  {equipo.url_logo && (
                    <Col md={4} className="text-center">
                      <img 
                        src={equipo.url_logo} 
                        alt={`Logo de ${equipo.nombre_equipo}`} 
                        className="img-fluid" 
                        style={{ maxHeight: '120px' }}
                      />
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          )}
          
          <Card>
            <Card.Header>Evaluaciones</Card.Header>
            <Card.Body>
              {videojuego.evaluaciones?.length > 0 ? (
                <p>Este videojuego tiene {videojuego.evaluaciones.length} evaluaciones.</p>
              ) : (
                <Alert variant="info">
                  Este videojuego aún no ha sido evaluado por ningún jurado.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Detalles del Videojuego</Card.Header>
            <Card.Body>
              <dl className="row mb-0">
                <dt className="col-sm-5">ID:</dt>
                <dd className="col-sm-7">{videojuego.id}</dd>
                
                <dt className="col-sm-5">Equipo ID:</dt>
                <dd className="col-sm-7">{videojuego.equipo_id}</dd>
                
                <dt className="col-sm-5">Fecha de creación:</dt>
                <dd className="col-sm-7">
                  {new Date(videojuego.create_at).toLocaleDateString()}
                </dd>
                
                <dt className="col-sm-5">Última actualización:</dt>
                <dd className="col-sm-7">
                  {new Date(videojuego.update_at).toLocaleDateString()}
                </dd>
              </dl>
            </Card.Body>
            <Card.Footer>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  as={Link} 
                  to={`/videojuegos/${videojuego.id}/editar`}
                >
                  Editar Videojuego
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      <div className="mt-4">
        <Button 
          variant="outline-secondary" 
          as={Link} 
          to="/videojuegos"
        >
          Volver a la lista de videojuegos
        </Button>
      </div>
    </Container>
  );
};

export default VideojuegoDetails;