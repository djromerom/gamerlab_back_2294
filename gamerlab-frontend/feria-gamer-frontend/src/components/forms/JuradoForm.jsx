import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

const JuradoForm = ({ onSubmit, initialData = {}, isLoading, error }) => {
  // Generate a token for new jurado
  const [token, setToken] = useState('');
  
  useEffect(() => {
    if (!initialData.token_confirmacion) {
      // Generate a random token - in a real app you'd do this on the server
      const randomToken = uuidv4();
      setToken(randomToken);
    }
  }, [initialData.token_confirmacion]);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...initialData,
      token_confirmacion: initialData.token_confirmacion || token
    },
  });

  return (
    <Form onSubmit={handleSubmit((data) => onSubmit({...data, token_confirmacion: data.token_confirmacion || token}))}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>ID de Usuario</Form.Label>
        <Form.Control
          type="number"
          {...register('id_user', { 
            required: 'Este campo es obligatorio',
            valueAsNumber: true
          })}
          isInvalid={!!errors.id_user}
        />
        <Form.Control.Feedback type="invalid">
          {errors.id_user?.message}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          ID del usuario que será jurado. El usuario debe existir en el sistema.
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Token de Confirmación</Form.Label>
        <Form.Control
          type="text"
          value={initialData.token_confirmacion || token}
          readOnly
        />
        <Form.Text className="text-muted">
          Token generado automáticamente para la confirmación del jurado.
        </Form.Text>
      </Form.Group>
      
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
    </Form>
  );
};

export default JuradoForm;