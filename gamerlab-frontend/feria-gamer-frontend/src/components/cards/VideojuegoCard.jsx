import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const VideojuegoCard = ({ videojuego, equipo = null }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{videojuego.nombre_videojuego}</Card.Title>
        
        <Card.Text className="mb-2">
          {videojuego.descripcion.length > 100 
            ? `${videojuego.descripcion.substring(0, 100)}...` 
            : videojuego.descripcion}
        </Card.Text>
        
        {equipo && (
          <Card.Text>
            <strong>Equipo:</strong> {equipo.nombre_equipo}
          </Card.Text>
        )}
        
        <div className="mt-auto">
          <Link to={`/videojuegos/${videojuego.id}`}>
            <Button variant="outline-primary" className="w-100">Ver Detalles</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VideojuegoCard;