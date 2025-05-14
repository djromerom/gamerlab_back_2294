import React, { useState } from 'react';
import { Container, Alert, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EquipoForm from '../../components/forms/EquipoForm';
import { createEquipo } from '../../api/equipoApi';

const EquipoCreate = () => {

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [equipoId, setEquipoId] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError(null);
      const response = await createEquipo(data);
      setSuccess(true);
      setEquipoId(response.id);
    } catch (err) {
      setError('Error al crear equipo: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Registrar Nuevo Equipo</h1>
      
      {success ? (
        <Card className="mb-4">
          <Card.Body>
            <Alert variant="success">
              <Alert.Heading>¡Equipo creado con éxito!</Alert.Heading>
              <p>
                Tu equipo ha sido registrado correctamente. Ahora puedes añadir integrantes
                al equipo y registrar tu videojuego.
              </p>
            </Alert>
            
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                as={Link} 
                to={`/equipos/${equipoId}`}
              >
                Ver Detalles del Equipo
              </Button>
              <Button 
                variant="outline-secondary" 
                as={Link} 
                to="/equipos"
              >
                Volver a la Lista de Equipos
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <EquipoForm
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
            to="/equipos"
          >
            Cancelar
          </Button>
        </div>
      )}
    </Container>
  );
};

export default EquipoCreate;