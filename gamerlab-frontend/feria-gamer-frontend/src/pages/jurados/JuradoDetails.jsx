import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Container, Row, Col, Card, Button, Badge, Alert, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getJuradoById, asignarVideojuego, eliminarAsignacion } from '../../api/juradoApi';
import { getAllVideojuegos } from '../../api/videojuegoApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

const JuradoDetails = () => {
  const { id } = useParams();
  
  const [jurado, setJurado] = useState(null);
  const [videojuegos, setVideojuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedVideojuego, setSelectedVideojuego] = useState(null);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [juradoData, videojuegosData] = await Promise.all([
        getJuradoById(parseInt(id)),
        getAllVideojuegos()
      ]);
      
      setJurado(juradoData);
      setVideojuegos(videojuegosData);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAsignarVideojuego = async () => {
    if (!selectedVideojuego) return;
    
    try {
      setActionLoading(true);
      await asignarVideojuego(parseInt(id), selectedVideojuego.id);
      setShowAsignarModal(false);
      fetchData();
    } catch (err) {
      setError('Error al asignar videojuego: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEliminarAsignacion = async () => {
    if (!selectedVideojuego) return;
    
    try {
      setActionLoading(true);
      await eliminarAsignacion(parseInt(id), selectedVideojuego.id);
      setShowEliminarModal(false);
      fetchData();
    } catch (err) {
      setError('Error al eliminar asignación: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Filter videojuegos that are not already assigned to this jurado
  const videojuegosNoAsignados = videojuegos.filter(videojuego => 
    !jurado?.asignaciones?.some(asignacion => 
      asignacion.id_videojuego === videojuego.id
    )
  );

  if (loading) {
    return <LoadingSpinner text="Cargando información del jurado..." />;
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/jurados" variant="outline-primary">
          Volver a la lista de jurados
        </Button>
      </Container>
    );
  }

  if (!jurado) {
    return (
      <Container className="py-4">
        <Alert variant="warning">Jurado no encontrado</Alert>
        <Button as={Link} to="/jurados" variant="outline-primary">
          Volver a la lista de jurados
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Jurado: {jurado.usuario?.nombre_completo}</h1>
        <Badge bg={jurado.estado === 'confirmado' ? 'success' : 'warning'} className="fs-6">
          {jurado.estado}
        </Badge>
      </div>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Información del Jurado</Card.Title>
              
              <dl className="row mb-0">
                <dt className="col-sm-4">ID:</dt>
                <dd className="col-sm-8">{jurado.id}</dd>
                
                <dt className="col-sm-4">Usuario ID:</dt>
                <dd className="col-sm-8">{jurado.id_user}</dd>
                
                <dt className="col-sm-4">Email:</dt>
                <dd className="col-sm-8">{jurado.usuario?.email}</dd>
                
                <dt className="col-sm-4">Estado:</dt>
                <dd className="col-sm-8">
                  <Badge bg={jurado.estado === 'confirmado' ? 'success' : 'warning'}>
                    {jurado.estado}
                  </Badge>
                </dd>
                
                <dt className="col-sm-4">Última conexión:</dt>
                <dd className="col-sm-8">
                  {new Date(jurado.ultima_conexion).toLocaleString()}
                </dd>
                
                <dt className="col-sm-4">Fecha de creación:</dt>
                <dd className="col-sm-8">
                  {new Date(jurado.create_at).toLocaleDateString()}
                </dd>
              </dl>
            </Card.Body>
            <Card.Footer>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  as={Link} 
                  to={`/jurados/${jurado.id}/editar`}
                >
                  Editar Jurado
                </Button>
                
                {jurado.estado === 'no_confirmado' && (
                  <Button 
                    variant="warning"
                    as={Link}
                    to={`/jurados/${jurado.id}/reenviar-invitacion`}
                  >
                    Reenviar Invitación
                  </Button>
                )}
              </div>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Videojuegos Asignados</h5>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setShowAsignarModal(true)}
                disabled={videojuegosNoAsignados.length === 0}
              >
                Asignar Videojuego
              </Button>
            </Card.Header>
            <Card.Body>
              {jurado.asignaciones?.length > 0 ? (
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Equipo</th>
                      <th>Evaluado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jurado.asignaciones.map((asignacion) => {
                      const videojuego = asignacion.videojuego;
                      const evaluado = jurado.evaluaciones?.some(
                        e => e.videojuego_id === videojuego.id
                      );
                      
                      return (
                        <tr key={videojuego.id}>
                          <td>{videojuego.id}</td>
                          <td>{videojuego.nombre_videojuego}</td>
                          <td>{videojuego.equipo_id}</td>
                          <td>
                            <Badge bg={evaluado ? 'success' : 'secondary'}>
                              {evaluado ? 'Sí' : 'No'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                as={Link}
                                to={`/videojuegos/${videojuego.id}`}
                              >
                                Ver
                              </Button>
                              
                              {!evaluado && (
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVideojuego(videojuego);
                                    setShowEliminarModal(true);
                                  }}
                                >
                                  Eliminar
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  Este jurado aún no tiene videojuegos asignados.
                </Alert>
              )}
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Header>
              <h5 className="mb-0">Evaluaciones Realizadas</h5>
            </Card.Header>
            <Card.Body>
              {jurado.evaluaciones?.length > 0 ? (
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Videojuego</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jurado.evaluaciones.map((evaluacion) => (
                      <tr key={evaluacion.id}>
                        <td>{evaluacion.id}</td>
                        <td>{evaluacion.videojuego.nombre_videojuego}</td>
                        <td>{new Date(evaluacion.create_at).toLocaleString()}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            as={Link}
                            to={`/evaluaciones/${evaluacion.id}`}
                          >
                            Ver Evaluación
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  Este jurado aún no ha realizado evaluaciones.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="d-flex justify-content-between">
        <Button 
          variant="outline-secondary" 
          as={Link} 
          to="/jurados"
        >
          Volver a la lista de jurados
        </Button>
      </div>
      
      {/* Modal para asignar videojuego */}
      <ConfirmationModal
        show={showAsignarModal}
        onHide={() => setShowAsignarModal(false)}
        title="Asignar Videojuego"
        confirmLabel="Asignar"
        cancelLabel="Cancelar"
        confirmVariant="primary"
        onConfirm={handleAsignarVideojuego}
      >
        <Form.Group>
          <Form.Label>Selecciona un videojuego:</Form.Label>
          <Form.Select 
            onChange={(e) => {
              const selected = videojuegos.find(v => v.id === parseInt(e.target.value));
              setSelectedVideojuego(selected);
            }}
          >
            <option value="">Seleccionar...</option>
            {videojuegosNoAsignados.map(videojuego => (
              <option key={videojuego.id} value={videojuego.id}>
                {videojuego.nombre_videojuego}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </ConfirmationModal>
      
      {/* Modal para eliminar asignación */}
      <ConfirmationModal
        show={showEliminarModal}
        onHide={() => setShowEliminarModal(false)}
        title="Eliminar Asignación"
        message={`¿Estás seguro de eliminar la asignación del videojuego "${selectedVideojuego?.nombre_videojuego}"?`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        confirmVariant="danger"
        onConfirm={handleEliminarAsignacion}
      />
    </Container>
  );
};

export default JuradoDetails;