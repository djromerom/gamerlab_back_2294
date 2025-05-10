import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllVideojuegos } from '../../api/videojuegoApi';
import VideojuegoCard from '../../components/cards/VideojuegoCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VideojuegosList = () => {
  const [videojuegos, setVideojuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    equipo_id: '',
  });

  const fetchVideojuegos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.equipo_id) params.equipo_id = filters.equipo_id;
      
      const data = await getAllVideojuegos(params);
      setVideojuegos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los videojuegos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideojuegos();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchVideojuegos();
  };

  // Filter videojuegos by name (client-side filtering)
  const filteredVideojuegos = searchTerm 
    ? videojuegos.filter(videojuego => 
        videojuego.nombre_videojuego.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : videojuegos;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Videojuegos</h1>
        <Link to="/videojuegos/crear">
          <Button variant="primary">Registrar Nuevo Videojuego</Button>
        </Link>
      </div>
      
      <div className="mb-4">
        <Row>
          <Col md={8} className="mb-3">
            <InputGroup>
              <Form.Control
                placeholder="Buscar videojuego por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form onSubmit={applyFilters}>
              <Row>
                <Col sm={8}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="number"
                      name="equipo_id"
                      value={filters.equipo_id}
                      onChange={handleFilterChange}
                      placeholder="ID Equipo"
                    />
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Button type="submit" variant="outline-primary" className="w-100">
                    Filtrar
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
      
      {loading ? (
        <LoadingSpinner text="Cargando videojuegos..." />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredVideojuegos.length === 0 ? (
        <Alert variant="info">
          No se encontraron videojuegos. {searchTerm && 'Intenta con otro término de búsqueda.'}
        </Alert>
      ) : (
        <Row>
          {filteredVideojuegos.map(videojuego => (
            <Col key={videojuego.id} md={6} lg={4} className="mb-4">
              <VideojuegoCard videojuego={videojuego} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default VideojuegosList;