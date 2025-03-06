import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { HospitalContextProvider } from './context/HospitalContext.jsx';
import { StorageProvider } from './context/StorageContext.jsx';
import { IndexedDBProvider } from './context/IndexedDBContext.jsx';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); 
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
      
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HospitalContextProvider>
        <StorageProvider>
          <IndexedDBProvider>
            <App />
          </IndexedDBProvider>
        </StorageProvider>
      </HospitalContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)