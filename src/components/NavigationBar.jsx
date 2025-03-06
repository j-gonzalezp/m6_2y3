import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdateAlert(true);
      });
    }
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false); 
    navigate('/')
  };
  
  const handleUpdateApp = () => {
    window.location.reload();
  };

  return (
    <>
      {!isOnline && (
        <div className="bg-warning text-dark py-1 text-center">
          <small>Estás navegando sin conexión. Algunas funciones pueden no estar disponibles.</small>
        </div>
      )}
      
      {showUpdateAlert && (
        <div className="bg-info text-white py-1 text-center d-flex justify-content-center align-items-center">
          <small className="me-2">¡Nueva versión disponible!</small>
          <button 
            className="btn btn-sm btn-light"
            onClick={handleUpdateApp}
          >
            Actualizar ahora
          </button>
        </div>
      )}
      
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Hospital Salvador</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/team">Nuestro equipo</Nav.Link>
              <Nav.Link as={Link} to="/appointments">Agenda tu cita</Nav.Link>
              <NavDropdown title="Funciones PWA" id="pwa-features-dropdown">
                <NavDropdown.Item as={Link} to="/storage-demo">Almacenamiento</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/device-access">Acceso a Dispositivos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/medical-api">API Médica</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <NavDropdown title={isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"} id="navbarScrollingDropdown">
                {isLoggedIn ? (
                  <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
                ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/login">Iniciar sesión</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/register">Registrarse</NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
