import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { Toast, ToastContainer } from 'react-bootstrap';  
import { useNavigate } from 'react-router-dom';  

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [humanAnswer, setHumanAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('');

  const navigate = useNavigate();  

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaAnswer(num1 + num2);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (parseInt(humanAnswer) !== captchaAnswer) {
      setError('Por favor, resuelve correctamente el desafío matemático.');
      setToastMessage('Desafío incorrecto. Intenta nuevamente.');
      setToastVariant('danger');
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

     
      const response = await fetch('http://localhost:5000/register', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password, 
        }),
        
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al registrar el usuario');
        setToastMessage(`Error: ${data.message || 'Error al registrar el usuario'}`);
        setToastVariant('danger');
        setShowToast(true);
        setIsLoading(false);
        return;
      }

      setToastMessage('Registro exitoso.');
      setToastVariant('success');
      setShowToast(true);

      setTimeout(() => {
        navigate('/login');  
      }, 2000);

    } catch (err) {
      setError(err.message);
      setToastMessage(`Error: ${err.message}`);
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister} className="form-group">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="captcha" className="form-label">
            {captchaQuestion}
          </label>
          <input
            type="text"
            id="captcha"
            value={humanAnswer}
            onChange={(e) => setHumanAnswer(e.target.value)}
            className="form-control"
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default RegisterForm;
