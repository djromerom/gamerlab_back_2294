import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { getAllEquipos } from '../../api/equipoApi';

const VideojuegoForm = ({ onSubmit, initialData = {}, isLoading, error }) => {
  const [equipos, setEquipos] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(true);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const data = await getAllEquipos();
        setEquipos(data);
      } catch (err) {
        console.error('Error fetching equipos:', err);
      } finally {
        setLoadingEquipos(false);
      }
    };

    fetchEquipos();
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Nombre del Videojuego</Form.Label>
        <Form.Control
          type="text"
          {...register('nombre_videojuego', { 
            required: 'Este campo es obligatorio',
            minLength: {
              value: 3,
              message: 'El nombre debe tener al menos 3 caracteres'
            }
          })}
          isInvalid={!!errors.nombre_videojuego}
        />
        <Form.Control.Feedback type="invalid">
          {errors.nombre_videojuego?.message}
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          {...register('descripcion', { 
            required: 'Este campo es obligatorio',
            minLength: {
              value: 10,
              message: 'La descripción debe tener al menos 10 caracteres'
            },
            maxLength: {
              value: 300,
              message: 'La descripción no puede exceder los 300 caracteres'
            }
          })}
          isInvalid={!!errors.descripcion}
        />
        <Form.Control.Feedback type="invalid">
          {errors.descripcion?.message}
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Equipo</Form.Label>
        <Form.Select
          {...register('equipo_id', { 
            required: 'Debes seleccionar un equipo',
            valueAsNumber: true
          })}
          isInvalid={!!errors.equipo_id}
          disabled={loadingEquipos || initialData.id}
        >
          <option value="">Selecciona un equipo</option>
          {equipos.map(equipo => (
            <option key={equipo.id} value={equipo.id}>
              {equipo.nombre_equipo}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.equipo_id?.message}
        </Form.Control.Feedback>
        {loadingEquipos && (
          <Form.Text className="text-muted">
            Cargando equipos...
          </Form.Text>
        )}
      </Form.Group>
      
      <Button variant="primary" type="submit" disabled={isLoading || loadingEquipos}>
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
    </Form>
  );
};

export default VideojuegoForm;