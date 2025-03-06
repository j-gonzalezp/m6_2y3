import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Enviando datos:', { email, password });
      
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Log de la respuesta HTTP completa
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
  
      const data = await response.json();
      console.log('Datos completos de la respuesta:', data);
  
      if (data.success) {
        if (!data.role) {
          console.warn('⚠️ Respuesta exitosa pero sin rol:', data);
        }
  
        // Guardar datos
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || '');  // Asegurar que siempre se guarde algo
  
        // Verificación
        const stored = {
          token: localStorage.getItem('token'),
          role: localStorage.getItem('role')
        };
        console.log('Datos almacenados:', stored);

        // Redirigir según el rol
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Error desconocido');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Introduce tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          <Button variant="primary" type="submit" className="w-100 mt-3">
            Iniciar sesión
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default LoginForm;
