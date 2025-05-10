import React from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';

const EstudianteForm = ({ onSubmit, isLoading, error }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      estudiantes: [{ nombre_completo: '', email: '', github: '' }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "estudiantes"
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Integrantes del Equipo</h5>
        </Card.Header>
        <Card.Body>
          {fields.map((field, index) => (
            <div key={field.id} className="p-3 border rounded mb-3">
              <div className="d-flex justify-content-between">
                <h5>Integrante {index + 1}</h5>
                {index > 0 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => remove(index)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  {...register(`estudiantes.${index}.nombre_completo`, { 
                    required: 'Este campo es obligatorio' 
                  })}
                  isInvalid={!!errors.estudiantes?.[index]?.nombre_completo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.estudiantes?.[index]?.nombre_completo?.message}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email Institucional</Form.Label>
                <Form.Control
                  type="email"
                  {...register(`estudiantes.${index}.email`, { 
                    required: 'Este campo es obligatorio',
                    pattern: {
                      value: /@uninorte\.edu\.co$/,
                      message: 'Debe ser un correo institucional de Uninorte'
                    }
                  })}
                  isInvalid={!!errors.estudiantes?.[index]?.email}
                  placeholder="ejemplo@uninorte.edu.co"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.estudiantes?.[index]?.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Usuario de GitHub</Form.Label>
                <Form.Control
                  type="text"
                  {...register(`estudiantes.${index}.github`, { 
                    required: 'Este campo es obligatorio' 
                  })}
                  isInvalid={!!errors.estudiantes?.[index]?.github}
                  placeholder="usuariogithub"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.estudiantes?.[index]?.github?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          ))}
          
          <div className="text-center">
            <Button 
              variant="outline-primary" 
              onClick={() => append({ nombre_completo: '', email: '', github: '' })}
            >
              + Agregar Integrante
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      <div className="d-grid">
        <Button 
          variant="primary" 
          type="submit" 
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? 'Registrando Integrantes...' : 'Registrar Integrantes'}
        </Button>
      </div>
    </Form>
  );
};

export default EstudianteForm;