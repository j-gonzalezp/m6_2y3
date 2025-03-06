import {
    getAllServices, getAllDoctors, getAllDoctorServices, createAppointment, getAppointments,
    updateAppointment,
    deleteAppointment,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
} from '../models/hospitalModel.js';

// Obtener todos los servicios
const getAllServicesController = async (req, res) => {
    try {
        const services = await getAllServices();
        res.status(200).json(services);
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        res.status(500).json({ message: 'Error al obtener los servicios' });
    }
};

// Obtener todos los doctores
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await getAllDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error al obtener los doctores:', error);
        res.status(500).json({ message: 'Error al obtener los doctores' });
    }
};

// Obtener servicios por doctor



const createAppointmentController = async (req, res) => {
    const { doctor_id, patient_name, service_id, appointment_date } = req.body;

    // Validación de los campos
    if (!doctor_id || !patient_name || !service_id || !appointment_date) {
        return res.status(400).json({ error: 'Todos los campos deben estar completos' });
    }

    try {
        // Llamar al modelo para insertar la cita
        const appointment = await createAppointment(doctor_id, patient_name, service_id, appointment_date);

        // Responder con la cita recién creada
        res.status(201).json({ message: 'Cita creada con éxito', appointment });
    } catch (error) {
        console.error(error.message || 'Ocurrió un error desconocido');
        res.status(500).json({ error: 'Error al crear la cita' });
    }
};

const getAllDoctorServicesController = async (req, res) => {
    try {
        const doctorServices = await getAllDoctorServices();
        res.status(200).json(doctorServices);
    } catch (error) {
        console.error('Error al obtener los servicios de los doctores:', error);
        res.status(500).json({ message: 'Error al obtener los servicios de los doctores' });
    }
};


// Obtener todas las citas
const getAppointmentsController = async (req, res) => {
    try {
        const appointments = await getAppointments();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las citas: ' + error.message });
    }
};

// Obtener una cita por ID
const getAppointmentController = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await getAppointmentById(id);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(404).json({ error: 'Cita no encontrada: ' + error.message });
    }
};

// Crear una nueva cita
const createNewAppointmentController = async (req, res) => {
    const { doctor_id, patient_name, service_id, appointment_date } = req.body;

    if (!doctor_id || !patient_name || !service_id || !appointment_date) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const newAppointment = await createAppointment(doctor_id, patient_name, service_id, appointment_date);
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la cita: ' + error.message });
    }
};

// Actualizar una cita
const updateAppointmentController = async (req, res) => {
    const { id } = req.params;
    const { doctor_id, patient_name, service_id, appointment_date } = req.body;

    if (!doctor_id || !patient_name || !service_id || !appointment_date) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const updatedAppointment = await updateAppointment(id, doctor_id, patient_name, service_id, appointment_date);
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(404).json({ error: 'Error al actualizar la cita: ' + error.message });
    }
};

// Eliminar una cita
const deleteAppointmentController = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAppointment = await deleteAppointment(id);
        res.status(200).json(deletedAppointment);
    } catch (error) {
        res.status(404).json({ error: 'Error al eliminar la cita: ' + error.message });
    }
};

const getDoctorsController = async (req, res) => {
    try {
        const doctors = await getAllDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los doctores: ' + error.message });
    }
};

// Obtener un doctor por ID
const getDoctorController = async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await getDoctorById(id);
        res.status(200).json(doctor);
    } catch (error) {
        res.status(404).json({ error: 'Doctor no encontrado: ' + error.message });
    }
};

// Crear un nuevo doctor
const createDoctorController = async (req, res) => {
    const { name, specialty, email } = req.body;

    if (!name || !specialty || !email) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const newDoctor = await createDoctor(name, specialty, email);
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el doctor: ' + error.message });
    }
};

// Actualizar un doctor
const updateDoctorController = async (req, res) => {
    const { id } = req.params;
    const { name, specialty, email } = req.body;

    if (!name || !specialty || !email) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const updatedDoctor = await updateDoctor(id, name, specialty, email);
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(404).json({ error: 'Error al actualizar el doctor: ' + error.message });
    }
};

// Eliminar un doctor
const deleteDoctorController = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDoctor = await deleteDoctor(id);
        res.status(200).json(deletedDoctor);
    } catch (error) {
        res.status(404).json({ error: 'Error al eliminar el doctor: ' + error.message });
    }
};



export {
    getAllServicesController,
    getAllDoctorsController,
    createAppointmentController,
    getAllDoctorServicesController,
    getAppointmentsController,
    getAppointmentController,
    createNewAppointmentController,
    updateAppointmentController,
    deleteAppointmentController,
    getDoctorsController,
    getDoctorController,
    createDoctorController,
    updateDoctorController,
    deleteDoctorController,
};
