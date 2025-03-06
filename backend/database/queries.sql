-- Crear la tabla de servicios
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

-- Crear la tabla de doctores
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    years_experience INT NOT NULL
);

-- Crear la tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) NOT NULL
);

-- Crear la tabla de relaciones entre doctores y servicios
CREATE TABLE doctor_services (
    id SERIAL PRIMARY KEY,
    doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE
);

-- Insertar datos en la tabla services
INSERT INTO services (name, description) VALUES
('Quimioterapia Oncológica', 'Tratamiento de quimioterapia para combatir diferentes tipos de cáncer, con un enfoque personalizado según las características del paciente y su enfermedad.'),
('Asesoría Nutricional Personalizada', 'Orientación y planes nutricionales adaptados a las necesidades específicas de cada paciente, con seguimiento continuo y ajustes según los objetivos de salud y bienestar.'),
('Cirugía Laparoscópica', 'Procedimiento quirúrgico mínimamente invasivo para tratar enfermedades gastrointestinales, hepáticas y otros problemas abdominales con menor tiempo de recuperación.'),
('Manejo de Trastornos Metabólicos', 'Evaluación y tratamiento de trastornos metabólicos como diabetes, dislipidemia y enfermedades endocrinas con enfoque en el control y prevención a largo plazo.'),
('Tratamiento de Infecciones Complejas', 'Manejo integral de infecciones bacterianas, virales y fúngicas, con especialización en infecciones complejas y multirresistentes.'),
('Rehabilitación Deportiva', 'Servicio especializado en la recuperación de lesiones deportivas, con un enfoque integral de medicina deportiva, fisioterapia y entrenamiento personalizado.'),
('Tratamiento para Incontinencia Urinaria', 'Diagnóstico y tratamiento avanzado para incontinencia urinaria, utilizando opciones médicas y quirúrgicas personalizadas para cada paciente.'),
('Terapias Cognitivas Conductuales', 'Tratamiento psicológico basado en terapias cognitivo-conductuales para tratar ansiedad, depresión y otros trastornos emocionales.');

-- Insertar datos en la tabla doctors
INSERT INTO doctors (name, specialty, years_experience) VALUES
('Dr. Ricardo Soto', 'Medicina Deportiva', 3),
('Dr. Valeria Díaz', 'Nutrición', 4),
('Dr. Natalia Muñoz', 'Psicología', 6),
('Dr. Alejandro Vega', 'Cirugía General', 18),
('Dr. Camila Castillo', 'Urología', 5),
('Dr. Manuel Herrera', 'Oncología', 20),
('Dr. Javier Fernández', 'Endocrinología', 12),
('Dr. Fernanda Reyes', 'Infectología', 14);

-- Insertar datos en la tabla users
INSERT INTO users (email, password_hash, created_at, role) VALUES
('test@test.cl', '$2a$10$bA/c.4l4NrDziCivF1lJ8.87VmfbbndR5IThe0ndar/2l8Sp4rvD6', '2025-01-10 15:19:49.558803+00', 'user'),
('a1@a.cl', '$2a$10$LLtAJ8gFqr5DIJWuhw48DOaU9GrH/v1BEm8BaoOJT6cA5g1AaO7gO', '2025-01-10 15:18:33.83094+00', 'user'),
('a@a.cl', '$2a$10$4mv69LE912xtCiIbToSCW.EU17MN3IC5LUXmklRDf9LugSrsnQ7dO', '2025-01-10 15:16:01.499862+00', 'user'),
('hola2@2.cl', '$2a$10$JlxrQpsrWW0DieYh5q/dmuzYGKApga0Zm/2d.oRjJPt/llpkKwjBK', '2025-01-10 15:21:50.629001+00', 'user'),
('admin@salvador.cl', '$2a$10$6evNoCS2SUx30ZGxSExCROe.9Z8ywzpBNaTwrkH0pVWrfc1L2B9v2', '2025-01-10 17:21:46.782403+00', 'admin'),
('usuario1@a.cl', '$2a$10$4W9GAGvsesGtfaZPQdIAVO5WyNjNvpKMuNJPRoZvzu3BWrvk16/.K', '2025-01-10 16:55:20.893054+00', 'user');

-- Insertar datos en la tabla doctor_services
INSERT INTO doctor_services (doctor_id, service_id) VALUES
(1, 6),
(2, 2),
(3, 8),
(4, 3),
(5, 7),
(6, 1),
(7, 4),
(8, 5);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    doctor_id INT NOT NULL,
    service_id INT NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (doctor_id) REFERENCES doctors (id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
);
