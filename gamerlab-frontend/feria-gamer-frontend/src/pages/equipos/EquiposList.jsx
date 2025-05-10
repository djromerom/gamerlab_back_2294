import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllEquipos } from '../../api/equipoApi';
import EquipoCard from '../../components/cards/EquipoCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EquiposList = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    materiaId: '',
    codigoNrc: ''
  });

  const fetchEquipos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.materiaId) params.materiaId = filters.materiaId;
      if (filters.codigoNrc) params.codigoNrc = filters.codigoNrc;
      
      const data = await getAllEquipos(params);
      setEquipos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los equipos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchEquipos();
  };

  // Filter equipos by name (client-side filtering)
  const filteredEquipos = searchTerm 
    ? equipos.filter(equipo => 
        equipo.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : equipos;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Equipos</h1>
        <Link to="/equipos/crear">
          <Button variant="primary">Registrar Nuevo Equipo</Button>
        </Link>
      </div>
      
      <div className="mb-4">
        <Row>
          <Col md={6} className="mb-3">
            <InputGroup>
              <Form.Control
                placeholder="Buscar equipo por nombre..."
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
          <Col md={6}>
            <Form onSubmit={applyFilters}>
              <Row>
                <Col sm={5}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="number"
                      name="materiaId"
                      value={filters.materiaId}
                      onChange={handleFilterChange}
                      placeholder="ID Materia"
                    />
                  </Form.Group>
                </Col>
                <Col sm={5}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="number"
                      name="codigoNrc"
                      value={filters.codigoNrc}
                      onChange={handleFilterChange}
                      placeholder="NRC"
                    />
                  </Form.Group>
                </Col>
                <Col sm={2}>
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
        <LoadingSpinner text="Cargando equipos..." />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredEquipos.length === 0 ? (
        <Alert variant="info">
          No se encontraron equipos. {searchTerm && 'Intenta con otro término de búsqueda.'}
        </Alert>
      ) : (
        <Row>
          {filteredEquipos.map(equipo => (
            <Col key={equipo.id} md={6} lg={4} className="mb-4">
              <EquipoCard equipo={equipo} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default EquiposList;