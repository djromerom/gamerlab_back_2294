import React, { useState } from 'react';
import { Container, Alert, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import VideojuegoForm from '../../components/forms/VideojuegoForm';
import { createVideojuego } from '../../api/videojuegoApi';

const VideojuegoCreate = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [videojuegoId, setVideojuegoId] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError(null);
      const response = await createVideojuego({
        ...data,
        equipo_id: parseInt(data.equipo_id)
      });
      setSuccess(true);
      setVideojuegoId(response.id);
    } catch (err) {
      setError('Error al crear videojuego: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Registrar Nuevo Videojuego</h1>
      
      {success ? (
        <Card className="mb-4">
          <Card.Body>
            <Alert variant="success">
              <Alert.Heading>¡Videojuego registrado con éxito!</Alert.Heading>
              <p>
                Tu videojuego ha sido registrado correctamente y será evaluado por los jurados.
              </p>
            </Alert>
            
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                as={Link} 
                to={`/videojuegos/${videojuegoId}`}
              >
                Ver Detalles del Videojuego
              </Button>
              <Button 
                variant="outline-secondary" 
                as={Link} 
                to="/videojuegos"
              >
                Volver a la Lista de Videojuegos
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <VideojuegoForm
              onSubmit={handleSubmit}
              isLoading={saving}
              error={error}
            />
          </Card.Body>
        </Card>
      )}
      
      {!success && (
        <div className="mt-3">
          <Button 
            variant="outline-secondary" 
            as={Link} 
            to="/videojuegos"
          >
            Cancelar
          </Button>
        </div>
      )}
    </Container>
  );
};

export default VideojuegoCreate;