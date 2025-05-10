import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EquipoCard = ({ equipo }) => {
  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'Pendiente_confirmacion':
        return 'warning';
      case 'Inscrito_confirmado':
        return 'info';
      case 'Inscripcion_completa':
        return 'success';
      case 'Rechazada':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      {equipo.url_logo && (
        <div className="text-center p-3 bg-light">
          <Card.Img 
            variant="top" 
            src={equipo.url_logo} 
            alt={`Logo de ${equipo.nombre_equipo}`}
            style={{ height: '120px', width: 'auto', objectFit: 'contain' }}
          />
        </div>
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{equipo.nombre_equipo}</Card.Title>
        
        <div className="mb-2">
          <Badge bg={getEstadoBadgeVariant(equipo.estado)}>
            {equipo.estado.replace('_', ' ')}
          </Badge>
        </div>
        
        <Card.Text>
          <strong>Integrantes:</strong> {equipo.estudiantes?.length || 0}
        </Card.Text>
        
        {equipo.videojuegos?.length > 0 && (
          <Card.Text>
            <strong>Videojuegos:</strong> {equipo.videojuegos.length}
          </Card.Text>
        )}
        
        <div className="mt-auto">
          <Link to={`/equipos/${equipo.id}`}>
            <Button variant="outline-primary" className="w-100">Ver Detalles</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EquipoCard;