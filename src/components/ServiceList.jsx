import React from 'react';
import PropTypes from 'prop-types';

const ServiceList = ({ services }) => {
  return (
    <>
      <h2>Lista de Servicios</h2>
      {services.length > 0 ? (
        <ul>
          {services.map((service) => (
            <li key={service.id}>{service.name}</li>
          ))}
        </ul>
      ) : (
        <p>No hay servicios disponibles.</p>
      )}
    </>
  );
};

ServiceList.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ServiceList;
