import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHospital } from '../context/HospitalContext';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const AppointmentForm = () => {
  const {
    services,
    doctors,
    doctorServices,
    fetchServices,
    fetchDoctors,
    fetchDoctorServices,
  } = useHospital();

  const nameInputRef = useRef(null);

  const [selectedService, setSelectedService] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [filteredServices, setFilteredServices] = useState(services);
  const [showMessage, setShowMessage] = useState(false);


  useEffect(() => {
    console.log("Llamando a fetchDoctorServices...");
    fetchServices();
    fetchDoctors();
    fetchDoctorServices();
  }, []);
  

  
  const handleServiceChange = (event) => {
    const serviceId = event.target.value;
    setSelectedService(serviceId);
    
   
    if (!serviceId) {
      setFilteredDoctors(doctors);
    } else {
      
      const doctorIdsWithService = doctorServices
        .filter((ds) => ds.service_id === parseInt(serviceId))
        .map((ds) => ds.doctor_id);
      
   
      const doctorsFiltered = doctors.filter((doctor) =>
        doctorIdsWithService.includes(doctor.id)
      );
      
      setFilteredDoctors(doctorsFiltered);
    }
  };
  
  

  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;
    setSelectedDoctor(doctorId);
  
 
    if (!doctorId) {
      setFilteredServices(services);
    } else {
     
      const serviceIdsWithDoctor = doctorServices
        .filter((ds) => ds.doctor_id === parseInt(doctorId)) 
        .map((ds) => ds.service_id);
  
     
      const servicesFiltered = services.filter((service) =>
        serviceIdsWithDoctor.includes(service.id)
      );
  
      setFilteredServices(servicesFiltered);
    }
  };
  
  const handleName = (e) => {
    setSelectedName(e.target.value);
  };

  const handleDate = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedName || !selectedService || !selectedDate) {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: selectedDoctor,
          patient_name: selectedName,
          service_id: selectedService,
          appointment_date: selectedDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      } else {
        console.error(data.error || 'Ocurrió un error en la solicitud');
      }
    } catch (error) {
      console.error(error.message || 'Ocurrió un error desconocido');
    }
  };

  useEffect(() => {
    setFilteredDoctors(doctors);
    setFilteredServices(services);
  }, [doctors, services]);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="fullName">Nombre completo</Form.Label>
            <Form.Control
              id="fullName"
              ref={nameInputRef}
              value={selectedName}
              onChange={handleName}
              placeholder="Escriba su nombre completo"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="service">Servicio</Form.Label>
            <Form.Select
              id="service"
              value={selectedService}
              onChange={handleServiceChange}
            >
              <option value="">Seleccione un servicio</option>
              {filteredServices.map((service) => (
                <option value={service.id} key={service.id}>
                  {service.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="doctor">Doctor</Form.Label>
            <Form.Select
              id="doctor"
              value={selectedDoctor}
              onChange={handleDoctorChange}
            >
              <option value="">Seleccione un doctor</option>
              {filteredDoctors.map((doctor) => (
                <option value={doctor.id} key={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="schedule">Horario</Form.Label>
            <Form.Control
              type="datetime-local"
              id="schedule"
              placeholder="Seleccione la fecha y hora"
              value={selectedDate}
              onChange={handleDate}
            />
          </Form.Group>

          <Button type="submit">Enviar</Button>
        </fieldset>
      </Form>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showMessage} onClose={() => setShowMessage(false)}>
          <Toast.Header>
            <strong className="me-auto">Cita Agendada</strong>
            <small>Ahora</small>
          </Toast.Header>
          <Toast.Body>¡Cita agendada exitosamente!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AppointmentForm;