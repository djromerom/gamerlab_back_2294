import React, { useState, useEffect } from 'react';
import { Container, Alert, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { confirmarJurado } from '../../api/juradoApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ConfirmJurado = () => {
  const { token } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [juradoInfo, setJuradoInfo] = useState(null);

  useEffect(() => {
    const confirmRegistration = async () => {
      if (!token) {
        setError('Token de confirmación no proporcionado');
        setLoading(false);
        return;
      }

      try {
        const data = await confirmarJurado(token);
        setSuccess(true);
        setJuradoInfo(data);
      } catch (err) {
        setError('Error al confirmar jurado: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    confirmRegistration();
  }, [token]);

  if (loading) {
    return <LoadingSpinner text="Procesando confirmación..." />;
  }

  return (
    <Container className="py-5 text-center">
      <h1 className="mb-4">Confirmación de Jurado</h1>
      
      {error ? (
        <Alert variant="danger">
          <Alert.Heading>Error al confirmar jurado</Alert.Heading>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Por favor, contacta al administrador del sistema si necesitas ayuda.
          </p>
        </Alert>
      ) : (
        <Alert variant="success">
          <Alert.Heading>¡Jurado confirmado con éxito!</Alert.Heading>
          <p>Tu participación como jurado en el evento ha sido confirmada.</p>
        </Alert>
      )}
      
      {juradoInfo && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Información del Jurado</Card.Title>
            <dl className="row justify-content-center">
              <dt className="col-sm-3 text-end">Nombre:</dt>
              <dd className="col-sm-9 text-start">{juradoInfo.usuario?.nombre_completo}</dd>
              
              <dt className="col-sm-3 text-end">Email:</dt>
              <dd className="col-sm-9 text-start">{juradoInfo.usuario?.email}</dd>
              
              <dt className="col-sm-3 text-end">Estado:</dt>
              <dd className="col-sm-9 text-start">{juradoInfo.estado}</dd>
            </dl>
          </Card.Body>
        </Card>
      )}
      
      <div className="mt-4">
        <Link to="/" className="btn btn-primary">
          Ir a la página principal
        </Link>
      </div>
    </Container>
  );
};

export default ConfirmJurado;