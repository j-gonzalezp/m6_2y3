import { pool } from '../database/connection.js';

// Obtener todos los servicios
const getAllServices = async () => {
    const query = {
        text: `SELECT * FROM services ORDER BY id;`,
        values: [],
    };

    const { rows } = await pool.query(query);
    return rows;
};


// Obtener todos los doctores
const getAllDoctors = async () => {
    const query = {
        text: `SELECT * FROM doctors ORDER BY id;`,
        values: [],
    };

    const { rows } = await pool.query(query);
    return rows;
};

const getAllDoctorServices = async () => {
    try {
        const query = 'SELECT * FROM doctor_services';  
        const result = await pool.query(query); // Cambié db por pool
        return result.rows; 
    } catch (error) {
        console.error('Error en la consulta de servicios de los doctores:', error);
        throw new Error('No se pudieron obtener los servicios de los doctores');
    }
};


const createAppointment = async (doctor_id, patient_name, service_id, appointment_date) => {
    try {
      const result = await pool.query(
        'INSERT INTO appointments (doctor_id, patient_name, service_id, appointment_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [doctor_id, patient_name, service_id, appointment_date]
      );
      return result.rows[0]; // Devuelve la cita recién creada
    } catch (error) {
      throw new Error('Error al insertar la cita: ' + error.message);
    }
  };



  const getAppointments = async () => {
    const query = {
        text: `SELECT 
                    a.id, 
                    a.doctor_id, 
                    d.name AS doctor_name, 
                    a.service_id, 
                    s.name AS service_name, 
                    a.patient_name, 
                    a.appointment_date 
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.id
                JOIN services s ON a.service_id = s.id
                ORDER BY a.id;`,
        values: [],
    };

    const { rows } = await pool.query(query);
    return rows;
};

// Obtener una cita por ID
const getAppointmentById = async (id) => {
    const query = {
        text: `SELECT 
                    a.id, 
                    a.doctor_id, 
                    d.name AS doctor_name, 
                    a.service_id, 
                    s.name AS service_name, 
                    a.patient_name, 
                    a.appointment_date 
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.id
                JOIN services s ON a.service_id = s.id
                WHERE a.id = $1;`,
        values: [id],
    };

    const { rows } = await pool.query(query);
    if (rows.length === 0) {
        throw new Error('Cita no encontrada');
    }
    return rows[0];
};


// Actualizar una cita
const updateAppointment = async (id, doctor_id, patient_name, service_id, appointment_date) => {
    const query = {
        text: `UPDATE appointments 
                SET doctor_id = $2, 
                    patient_name = $3, 
                    service_id = $4, 
                    appointment_date = $5, 
                    updated_at = NOW() 
                WHERE id = $1 
                RETURNING *;`,
        values: [id, doctor_id, patient_name, service_id, appointment_date],
    };

    const { rows } = await pool.query(query);
    if (rows.length === 0) {
        throw new Error('Cita no encontrada para actualizar');
    }
    return rows[0];
};

// Eliminar una cita
const deleteAppointment = async (id) => {
    const query = {
        text: `DELETE FROM appointments 
                WHERE id = $1 
                RETURNING *;`,
        values: [id],
    };

    const { rows } = await pool.query(query);
    if (rows.length === 0) {
        throw new Error('Cita no encontrada para eliminar');
    }
    return rows[0];
};


// Obtener un doctor por ID
const getDoctorById = async (id) => {
    const query = {
        text: `SELECT * FROM doctors WHERE id = $1;`,
        values: [id],
    };

    const { rows } = await pool.query(query);
    if (rows.length === 0) {
        throw new Error('Doctor no encontrado');
    }
    return rows[0];
};

// Crear un nuevo doctor
const createDoctor = async (name, specialty, email) => {
    const query = {
        text: `INSERT INTO doctors (name, specialty, email) VALUES ($1, $2, $3) RETURNING *;`,
        values: [name, specialty, email],
    };

    const { rows } = await pool.query(query);
    return rows[0];
};

// Actualizar un doctor
const updateDoctor = async (id, name, specialty, email) => {
    const query = {
        text: `
            UPDATE doctors 
            SET name = $2, specialty = $3, email = $4
            WHERE id = $1
            RETURNING *;
        `,
        values: [id, name, specialty, email],
    };

    const { rows } = await pool.query(query);
    if (rows.length === 0) {
        throw new Error('Doctor no encontrado');
    }
    return rows[0];
};

// Eliminar un doctor
const deleteDoctor = async (id) => {
    const query = {
        text: `DELETE FROM doctors WHERE id = $1 RETURNING *;`,
        values: [id],
    };

    const { rows } = await pool.query(query);
    if (rows.length === 0) {
        throw new Error('Doctor no encontrado');
    }
    return rows[0];
};




export { getAllServices, getAllDoctors, getAllDoctorServices,    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,  getDoctorById, createDoctor, updateDoctor, deleteDoctor}
