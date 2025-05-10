import React, { useState } from 'react';
import { Container, Alert, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import JuradoForm from '../../components/forms/JuradoForm';
import { createJurado } from '../../api/juradoApi';

const JuradoCreate = () => {
 
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [juradoId, setJuradoId] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError(null);
      const response = await createJurado({
        ...data,
        id_user: parseInt(data.id_user)
      });
      setSuccess(true);
      setJuradoId(response.id);
    } catch (err) {
      setError('Error al crear jurado: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Registrar Nuevo Jurado</h1>
      
      {success ? (
        <Card className="mb-4">
          <Card.Body>
            <Alert variant="success">
              <Alert.Heading>¡Jurado registrado con éxito!</Alert.Heading>
              <p>
                El jurado ha sido registrado correctamente. Se ha generado un token
                de confirmación que puede ser enviado al correo del jurado.
              </p>
            </Alert>
            
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                as={Link} 
                to={`/jurados/${juradoId}`}
              >
                Ver Detalles del Jurado
              </Button>
              <Button 
                variant="outline-secondary" 
                as={Link} 
                to="/jurados"
              >
                Volver a la Lista de Jurados
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <JuradoForm
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
            to="/jurados"
          >
            Cancelar
          </Button>
        </div>
      )}
    </Container>
  );
};

export default JuradoCreate;