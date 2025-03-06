import React from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import withModal from "./shared/withModal";
import DetailModal from "./DetailModal";

const DoctorCard = ({ doctor, onShowModal }) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src="https://via.placeholder.com/150"
        alt={`${doctor.name}'s photo`}
      />
      <Card.Body>
        <Card.Title>{doctor.name}</Card.Title>
        <Card.Text>
          <strong>Especialidad:</strong> {doctor.specialty}
        </Card.Text>
        <Card.Text>
          <strong>Años de experiencia:</strong> {doctor.years_experience}
        </Card.Text>
        <Button variant="primary" onClick={onShowModal}>
          Ver detalles
        </Button>
      </Card.Body>
    </Card>
  );
};

DoctorCard.propTypes = {
  doctor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    years_experience: PropTypes.number.isRequired,
  }).isRequired,
  onShowModal: PropTypes.func.isRequired,
};

export default withModal(DoctorCard, DetailModal);
