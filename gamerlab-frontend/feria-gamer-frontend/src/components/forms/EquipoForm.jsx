import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Estado } from '../../utils/constants';

const EquipoForm = ({ onSubmit, initialData = {}, isLoading, error }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Nombre del Equipo</Form.Label>
        <Form.Control
          type="text"
          {...register('nombre_equipo', { 
            required: 'Este campo es obligatorio' 
          })}
          isInvalid={!!errors.nombre_equipo}
        />
        <Form.Control.Feedback type="invalid">
          {errors.nombre_equipo?.message}
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>URL del Logo</Form.Label>
        <Form.Control
          type="text"
          {...register('url_logo')}
          placeholder="https://ejemplo.com/logo.png"
        />
        <Form.Text className="text-muted">
          Proporciona una URL de imagen para el logo de tu equipo.
        </Form.Text>
      </Form.Group>
      
      {initialData.id && (
        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Select
            {...register('estado')}
          >
            {Object.entries(Estado).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}
      
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
    </Form>
  );
};

export default EquipoForm;