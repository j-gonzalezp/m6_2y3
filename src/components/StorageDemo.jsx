import React, { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import { useIndexedDB } from '../context/IndexedDBContext';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Spinner } from 'react-bootstrap';

const StorageDemo = () => {
  const { 
    userPreferences, 
    lastVisitedPages, 
    saveUserPreferences, 
    addVisitedPage, 
    clearStorage 
  } = useStorage();
  
  const { 
    appointments, 
    loading, 
    error, 
    saveAppointment, 
    deleteAppointment, 
    clearAppointments,
    doctors
  } = useIndexedDB();

  const [theme, setTheme] = useState(userPreferences.theme);
  const [fontSize, setFontSize] = useState(userPreferences.fontSize);
  const [newPage, setNewPage] = useState('');
  const [operationResult, setOperationResult] = useState({ success: null, message: '' });
  
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  const savePreferences = () => {
    const result = saveUserPreferences({ theme, fontSize });
    setOperationResult({ 
      success: result, 
      message: result ? 'Preferences saved successfully!' : 'Error saving preferences' 
    });
    
    setTimeout(() => {
      setOperationResult({ success: null, message: '' });
    }, 3000);
  };

  const handleAddPage = () => {
    if (!newPage) return;
    
    const result = addVisitedPage(newPage);
    setOperationResult({
      success: result,
      message: result ? 'Page added to history!' : 'Error adding page to history'
    });
    
    setNewPage('');
    
    setTimeout(() => {
      setOperationResult({ success: null, message: '' });
    }, 3000);
  };

  const handleClearStorage = () => {
    const result = clearStorage();
    setOperationResult({
      success: result,
      message: result ? 'Local storage cleared!' : 'Error clearing storage'
    });
    
    setTimeout(() => {
      setOperationResult({ success: null, message: '' });
    }, 3000);
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAppointment = async () => {
    if (!newAppointment.patientName || !newAppointment.doctorId || !newAppointment.date) {
      setOperationResult({
        success: false,
        message: 'Please fill required fields'
      });
      return;
    }
    
    const appointment = {
      ...newAppointment,
      id: Date.now().toString(),
      patientId: Date.now().toString()
    };
    
    const result = await saveAppointment(appointment);
    
    setOperationResult({
      success: result,
      message: result ? 'Appointment saved to IndexedDB!' : 'Error saving appointment'
    });
    
    setNewAppointment({
      patientName: '',
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      reason: ''
    });
    
    setTimeout(() => {
      setOperationResult({ success: null, message: '' });
    }, 3000);
  };

  const handleDeleteAppointment = async (id) => {
    const result = await deleteAppointment(id);
    
    setOperationResult({
      success: result,
      message: result ? 'Appointment deleted!' : 'Error deleting appointment'
    });
    
    setTimeout(() => {
      setOperationResult({ success: null, message: '' });
    }, 3000);
  };

  const handleClearAppointments = async () => {
    const result = await clearAppointments();
    
    setOperationResult({
      success: result,
      message: result ? 'All appointments cleared!' : 'Error clearing appointments'
    });
    
    setTimeout(() => {
      setOperationResult({ success: null, message: '' });
    }, 3000);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Demostración de Almacenamiento</h1>
      
      {operationResult.message && (
        <Alert variant={operationResult.success ? 'success' : 'danger'}>
          {operationResult.message}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h5">LocalStorage</Card.Header>
            <Card.Body>
              <Card.Title>Preferencias de Usuario</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Tema</Form.Label>
                  <Form.Select value={theme} onChange={handleThemeChange}>
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Tamaño de Fuente</Form.Label>
                  <Form.Select value={fontSize} onChange={handleFontSizeChange}>
                    <option value="small">Pequeño</option>
                    <option value="medium">Mediano</option>
                    <option value="large">Grande</option>
                  </Form.Select>
                </Form.Group>
                
                <Button variant="primary" onClick={savePreferences}>
                  Guardar Preferencias
                </Button>
              </Form>
              
              <hr />
              
              <Card.Title>Últimas Páginas Visitadas</Card.Title>
              <Form className="mb-3">
                <Form.Group className="mb-2">
                  <Form.Label>Añadir página</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newPage} 
                    onChange={(e) => setNewPage(e.target.value)} 
                    placeholder="Nombre de la página" 
                  />
                </Form.Group>
                <Button variant="success" onClick={handleAddPage}>
                  Añadir
                </Button>
              </Form>
              
              <ListGroup>
                {lastVisitedPages.map((page, index) => (
                  <ListGroup.Item key={index}>{page}</ListGroup.Item>
                ))}
              </ListGroup>
              
              <Button 
                variant="danger" 
                className="mt-3" 
                onClick={handleClearStorage}
              >
                Limpiar Almacenamiento Local
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h5">IndexedDB</Card.Header>
            <Card.Body>
              <Card.Title>Gestión de Citas</Card.Title>
              
              {loading && <Spinner animation="border" />}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form className="mb-4">
                <Form.Group className="mb-2">
                  <Form.Label>Nombre del Paciente</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="patientName" 
                    value={newAppointment.patientName} 
                    onChange={handleAppointmentChange} 
                    placeholder="Nombre del paciente" 
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Select 
                    name="doctorId" 
                    value={newAppointment.doctorId} 
                    onChange={handleAppointmentChange}
                  >
                    <option value="">Seleccione un doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="date" 
                    value={newAppointment.date} 
                    onChange={handleAppointmentChange} 
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control 
                    type="time" 
                    name="time" 
                    value={newAppointment.time} 
                    onChange={handleAppointmentChange} 
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Motivo de la Consulta</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    name="reason" 
                    value={newAppointment.reason} 
                    onChange={handleAppointmentChange} 
                    placeholder="Describa el motivo de la consulta" 
                  />
                </Form.Group>
                
                <Button variant="primary" onClick={handleSaveAppointment}>
                  Guardar Cita
                </Button>
              </Form>
              
              <Card.Title>Citas Guardadas</Card.Title>
              {appointments.length === 0 ? (
                <p>No hay citas guardadas</p>
              ) : (
                <ListGroup>
                  {appointments.map(appointment => (
                    <ListGroup.Item key={appointment.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{appointment.patientName}</strong>
                        <br />
                        {appointment.date} {appointment.time}
                        <br />
                        {appointment.reason && <small>{appointment.reason}</small>}
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        Eliminar
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              
              {appointments.length > 0 && (
                <Button 
                  variant="danger" 
                  className="mt-3" 
                  onClick={handleClearAppointments}
                >
                  Eliminar Todas las Citas
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StorageDemo; 