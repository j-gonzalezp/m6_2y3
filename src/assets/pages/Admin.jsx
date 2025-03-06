import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup, Container, Row, Col } from 'react-bootstrap';

const Admin = () => {
  const [medicalTeams, setMedicalTeams] = useState([]);
  const [newMedicalTeam, setNewMedicalTeam] = useState({ name: '', specialization: '' });
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    doctor_id: '',
    patient_name: '',
    service_id: '',
    appointment_date: '',
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);

  useEffect(() => {
    fetchMedicalTeams();
    fetchAppointments();
  }, []);

  const fetchMedicalTeams = async () => {
    try {
      const response = await fetch('http://localhost:5000/doctors');
      const data = await response.json();
      setMedicalTeams(data);
    } catch (error) {
      console.error('Error fetching medical teams:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAddMedicalTeam = async () => {
    try {
      const response = await fetch('http://localhost:5000/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMedicalTeam),
      });
      const data = await response.json();
      setMedicalTeams([...medicalTeams, data]);
      setNewMedicalTeam({ name: '', specialization: '' });
    } catch (error) {
      console.error('Error adding medical team:', error);
    }
  };

  const handleDeleteMedicalTeam = async (id) => {
    try {
      await fetch(`http://localhost:5000/doctors/${id}`, {
        method: 'DELETE',
      });
      setMedicalTeams(medicalTeams.filter((team) => team.id !== id));
    } catch (error) {
      console.error('Error deleting medical team:', error);
    }
  };

  const handleEditDoctorClick = (doctor) => {
    setEditingDoctor({ ...doctor });
    setShowEditDoctorModal(true);
  };

  const handleUpdateDoctor = async () => {
    if (!editingDoctor) return;

    try {
      const response = await fetch(`http://localhost:5000/doctors/${editingDoctor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingDoctor),
      });
      const updatedDoctor = await response.json();
      setMedicalTeams(medicalTeams.map((team) =>
        team.id === updatedDoctor.id ? updatedDoctor : team
      ));
      setShowEditDoctorModal(false);
      setEditingDoctor(null);
    } catch (error) {
      console.error('Error updating doctor:', error);
    }
  };

  const handleAddAppointment = async () => {
    try {
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      });
      const data = await response.json();
      setAppointments([...appointments, data]);
      setNewAppointment({
        doctor_id: '',
        patient_name: '',
        service_id: '',
        appointment_date: '',
      });
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await fetch(`http://localhost:5000/appointments/${id}`, {
        method: 'DELETE',
      });
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleEditAppointmentClick = (appointment) => {
    setEditingAppointment({ ...appointment });
    setShowEditAppointmentModal(true);
  };

  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;

    try {
      const response = await fetch(`http://localhost:5000/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAppointment),
      });
      const updatedAppointment = await response.json();
      setAppointments(appointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      ));
      setShowEditAppointmentModal(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Admin Panel</h1>

      <section className="mb-5">
        <h2>Medical Teams</h2>
        <Form
          className="mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMedicalTeam();
          }}
        >
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Name"
                value={newMedicalTeam.name}
                onChange={(e) => setNewMedicalTeam({ ...newMedicalTeam, name: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Specialization"
                value={newMedicalTeam.specialization}
                onChange={(e) => setNewMedicalTeam({ ...newMedicalTeam, specialization: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Button type="submit" variant="primary">
                Add Medical Team
              </Button>
            </Col>
          </Row>
        </Form>
        <ListGroup>
          {medicalTeams.map((team) => (
            <ListGroup.Item key={team.id} className="d-flex justify-content-between align-items-center">
              <span>
                {team.name} ({team.specialization})
              </span>
              <div>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditDoctorClick(team)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteMedicalTeam(team.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </section>

      <section className="mb-5">
        <h2>Add Appointments</h2>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAppointment();
          }}
        >
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Patient Name"
                value={newAppointment.patient_name}
                onChange={(e) => setNewAppointment({ ...newAppointment, patient_name: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Doctor ID"
                value={newAppointment.doctor_id}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctor_id: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Service ID"
                value={newAppointment.service_id}
                onChange={(e) => setNewAppointment({ ...newAppointment, service_id: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="date"
                value={newAppointment.appointment_date}
                onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                required
              />
            </Col>
            <Col>
              <Button type="submit" variant="primary">
                Add Appointment
              </Button>
            </Col>
          </Row>
        </Form>
      </section>

      <section>
        <h2>Manage Appointments</h2>
        <ListGroup>
          {appointments.map((appointment) => (
            <ListGroup.Item key={appointment.id} className="d-flex justify-content-between align-items-center">
              <span>
                {appointment.patient_name} - {appointment.appointment_date} (Doctor ID: {appointment.doctor_id}, Service ID: {appointment.service_id})
              </span>
              <div>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditAppointmentClick(appointment)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </section>

      {/* Doctor Edit Modal */}
      <Modal show={showEditDoctorModal} onHide={() => setShowEditDoctorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editingDoctor?.name || ''}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                type="text"
                value={editingDoctor?.specialization || ''}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditDoctorModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateDoctor}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Appointment Edit Modal */}
      <Modal show={showEditAppointmentModal} onHide={() => setShowEditAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                type="text"
                value={editingAppointment?.patient_name || ''}
                onChange={(e) => setEditingAppointment({ ...editingAppointment, patient_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Doctor ID</Form.Label>
              <Form.Control
                type="text"
                value={editingAppointment?.doctor_id || ''}
                onChange={(e) => setEditingAppointment({ ...editingAppointment, doctor_id: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service ID</Form.Label>
              <Form.Control
                type="text"
                value={editingAppointment?.service_id || ''}
                onChange={(e) => setEditingAppointment({ ...editingAppointment, service_id: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Appointment Date</Form.Label>
              <Form.Control
                type="date"
                value={editingAppointment?.appointment_date || ''}
                onChange={(e) => setEditingAppointment({ ...editingAppointment, appointment_date: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditAppointmentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateAppointment}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Admin;
