import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Table } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEquipoById, updateEquipo } from '../../api/equipoApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EstudianteForm from '../../components/forms/EstudianteForm';
import { addIntegrantes } from '../../api/equipoApi';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

const EquipoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddEstudiantes, setShowAddEstudiantes] = useState(false);
  const [addingEstudiantes, setAddingEstudiantes] = useState(false);
  const [estudiantesError, setEstudiantesError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchEquipo = async () => {
    try {
      setLoading(true);
      const data = await getEquipoById(parseInt(id));
      setEquipo(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el equipo: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipo();
  }, [id]);

  const handleAddEstudiantes = async (data) => {
    try {
      setAddingEstudiantes(true);
      setEstudiantesError(null);
      await addIntegrantes(parseInt(id), data.estudiantes);
      setShowAddEstudiantes(false);
      fetchEquipo(); // Refresh equipo data
    } catch (err) {
      setEstudiantesError('Error al añadir estudiantes: ' + (err.response?.data?.message || err.message));
    } finally {
      setAddingEstudiantes(false);
    }
  };

  const handleCompleteRegistration = async () => {
    try {
      await updateEquipo(parseInt(id), { estado: 'Inscripcion_completa' });
      fetchEquipo();
      setShowConfirmModal(false);
    } catch (err) {
      setError('Error al actualizar estado: ' + (err.response?.data?.message || err.message));
    }
  };

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Pendiente_confirmacion': return 'warning';
      case 'Inscrito_confirmado': return 'info';
      case 'Inscripcion_completa': return 'success';
      case 'Rechazada': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando información del equipo..." />;
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/equipos" variant="outline-primary">
          Volver a la lista de equipos
        </Button>
      </Container>
    );
  }

  if (!equipo) {
    return (
      <Container className="py-4">
        <Alert variant="warning">Equipo no encontrado</Alert>
        <Button as={Link} to="/equipos" variant="outline-primary">
          Volver a la lista de equipos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{equipo.nombre_equipo}</h1>
        <Badge bg={getEstadoBadgeVariant(equipo.estado)} className="fs-6">
          {equipo.estado.replace('_', ' ')}
        </Badge>
      </div>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Información del Equipo</Card.Title>
              
              {equipo.url_logo && (
                <div className="text-center my-3">
                  <img 
                    src={equipo.url_logo} 
                    alt={`Logo de ${equipo.nombre_equipo}`} 
                    className="img-fluid" 
                    style={{ maxHeight: '150px' }}
                  />
                </div>
              )}
              
              <dl className="row mb-0">
                <dt className="col-sm-4">ID:</dt>
                <dd className="col-sm-8">{equipo.id}</dd>
                
                <dt className="col-sm-4">Estado:</dt>
                <dd className="col-sm-8">
                  <Badge bg={getEstadoBadgeVariant(equipo.estado)}>
                    {equipo.estado.replace('_', ' ')}
                  </Badge>
                </dd>
                
                <dt className="col-sm-4">Fecha de creación:</dt>
                <dd className="col-sm-8">
                  {new Date(equipo.create_at).toLocaleDateString()}
                </dd>
                
                <dt className="col-sm-4">Última actualización:</dt>
                <dd className="col-sm-8">
                  {new Date(equipo.update_at).toLocaleDateString()}
                </dd>
              </dl>
            </Card.Body>
            <Card.Footer>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  as={Link} 
                  to={`/equipos/${equipo.id}/editar`}
                >
                  Editar Equipo
                </Button>
                {(equipo.estado === 'Inscrito_confirmado' || equipo.estado === 'Pendiente_confirmacion') && (
                  <Button 
                    variant="success" 
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Completar Registro
                  </Button>
                )}
              </div>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Integrantes</h5>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setShowAddEstudiantes(true)}
                disabled={showAddEstudiantes}
              >
                Añadir Integrantes
              </Button>
            </Card.Header>
            <Card.Body>
              {showAddEstudiantes ? (
                <>
                  <h4 className="mb-3">Añadir Nuevos Integrantes</h4>
                  <EstudianteForm 
                    onSubmit={handleAddEstudiantes}
                    isLoading={addingEstudiantes}
                    error={estudiantesError}
                  />
                  <div className="mt-3">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowAddEstudiantes(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : equipo.estudiantes?.length > 0 ? (
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>GitHub</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipo.estudiantes.map((estudiante) => (
                      <tr key={estudiante.id}>
                        <td>{estudiante.usuario?.nombre_completo}</td>
                        <td>{estudiante.usuario?.email}</td>
                        <td>{estudiante.github}</td>
                        <td>
                          <Badge bg={estudiante.confirmado ? 'success' : 'warning'}>
                            {estudiante.confirmado ? 'Confirmado' : 'Pendiente'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  Este equipo aún no tiene integrantes. Añade integrantes haciendo clic en el botón "Añadir Integrantes".
                </Alert>
              )}
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Videojuegos</h5>
              <Button 
                variant="primary" 
                size="sm" 
                as={Link}
                to="/videojuegos/crear"
              >
                Registrar Videojuego
              </Button>
            </Card.Header>
            <Card.Body>
              {equipo.videojuegos?.length > 0 ? (
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipo.videojuegos.map((videojuego) => (
                      <tr key={videojuego.id}>
                        <td>{videojuego.nombre_videojuego}</td>
                        <td>
                          {videojuego.descripcion.length > 50 
                            ? `${videojuego.descripcion.substring(0, 50)}...` 
                            : videojuego.descripcion}
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            as={Link}
                            to={`/videojuegos/${videojuego.id}`}
                          >
                            Ver Detalles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  Este equipo aún no tiene videojuegos registrados.
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
          to="/equipos"
        >
          Volver a la lista de equipos
        </Button>
      </div>
      
      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleCompleteRegistration}
        title="Completar Registro"
        message="¿Estás seguro de que deseas marcar la inscripción como completa? Esta acción no se puede deshacer."
        confirmLabel="Completar Registro"
        confirmVariant="success"
      />
    </Container>
  );
};

export default EquipoDetails;