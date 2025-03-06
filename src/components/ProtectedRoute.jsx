import React, { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element, path, ...rest }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); 

  useEffect(() => {
    if (!token) {
      navigate('/login');  
    } else if (path === '/admin' && userRole !== 'admin') {
      navigate('/');  
    }
  }, [token, userRole, path, navigate]);

  return <Route {...rest} path={path} element={element} />;
};

export default ProtectedRoute;
