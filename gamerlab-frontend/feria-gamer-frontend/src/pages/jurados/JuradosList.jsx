import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllJurados, reenviarInvitacion } from '../../api/juradoApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

const JuradosList = () => {
  const [jurados, setJurados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedJurado, setSelectedJurado] = useState(null);
  const [showReenviarModal, setShowReenviarModal] = useState(false);

  const fetchJurados = async () => {
    try {
      setLoading(true);
      const data = await getAllJurados();
      setJurados(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los jurados: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJurados();
  }, []);

  const handleReenviarInvitacion = async () => {
    if (!selectedJurado) return;
    
    try {
      setActionLoading(true);
      await reenviarInvitacion(selectedJurado.id);
      setShowReenviarModal(false);
      fetchJurados();
    } catch (err) {
      setError('Error al reenviar invitación: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const getEstadoBadgeVariant = (estado) => {
    return estado === 'confirmado' ? 'success' : 'warning';
  };

  if (loading) {
    return <LoadingSpinner text="Cargando jurados..." />;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Jurados</h1>
        <Link to="/jurados/crear">
          <Button variant="primary">Registrar Nuevo Jurado</Button>
        </Link>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {jurados.length === 0 ? (
        <Alert variant="info">
          No hay jurados registrados en el sistema.
        </Alert>
      ) : (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Evaluaciones</th>
              <th>Última Conexión</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {jurados.map(jurado => (
              <tr key={jurado.id}>
                <td>{jurado.id}</td>
                <td>{jurado.usuario?.nombre_completo}</td>
                <td>{jurado.usuario?.email}</td>
                <td>
                  <Badge bg={getEstadoBadgeVariant(jurado.estado)}>
                    {jurado.estado}
                  </Badge>
                </td>
                <td>{jurado.evaluaciones?.length || 0}</td>
                <td>{new Date(jurado.ultima_conexion).toLocaleString()}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      as={Link}
                      to={`/jurados/${jurado.id}`}
                    >
                      Detalles
                    </Button>
                    
                    {jurado.estado === 'no_confirmado' && (
                      <Button 
                        variant="outline-warning" 
                        size="sm"
                        onClick={() => {
                          setSelectedJurado(jurado);
                          setShowReenviarModal(true);
                        }}
                      >
                        Reenviar Invitación
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      <ConfirmationModal
        show={showReenviarModal}
        onHide={() => setShowReenviarModal(false)}
        onConfirm={handleReenviarInvitacion}
        title="Reenviar Invitación"
        message={`¿Deseas reenviar la invitación al jurado ${selectedJurado?.usuario?.nombre_completo}?`}
        confirmLabel="Reenviar"
        confirmVariant="warning"
      />
    </Container>
  );
};

export default JuradosList;