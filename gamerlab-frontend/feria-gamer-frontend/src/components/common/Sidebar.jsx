import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ items = [] }) => {
  const location = useLocation();

  return (
    <div className="sidebar bg-light p-3 rounded">
      <h5 className="mb-3">Navegación</h5>
      <ListGroup>
        {items.map((item, index) => (
          <ListGroup.Item
            key={index}
            as={Link}
            to={item.path}
            action
            active={location.pathname === item.path}
          >
            {item.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;