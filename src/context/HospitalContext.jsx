import React, { createContext, useContext, useState, useCallback } from "react";

export const HospitalContext = createContext();

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error("useHospital must be used within a HospitalContextProvider");
  }
  return context;
};

export const HospitalContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctorServices, setDoctorServices] = useState([]);

  const apiCall = useCallback(async (url, options = {}) => {
    const fetchOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      mode: 'cors',
      credentials: 'include'
    };

    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`API call failed: ${url}`, err);
      throw err;
    }
  }, []);

  const getDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall("http://localhost:5000/doctors");
      console.log("Doctores obtenidos:", data);
      setDoctors(data || []);
    } catch (err) {
      setError(`Error al obtener los doctores: ${err.message}`);
      console.log("Error en getDoctors:", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const fetchDoctors = useCallback(() => {
    getDoctors(); 
  }, [getDoctors]);
 
  const getServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall("http://localhost:5000/services");
      console.log("Servicios obtenidos:", data);
      setServices(data || []);
    } catch (err) {
      setError(`Error al obtener los servicios: ${err.message}`);
      console.log("Error en getServices:", err);
      setServices([]);
    } finally {
      setLoading(false);
      console.log("setLoading(false) en getServices");
    }
  }, [apiCall]);

  const fetchServices = useCallback(() => {
    getServices();
  }, [getServices]);

  const getDoctorServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall("http://localhost:5000/doctor-services");
      console.log("Servicios de doctores obtenidos:", data);
      setDoctorServices(data || []); 
    } catch (err) {
      setError(`Error al obtener los servicios de los doctores: ${err.message}`);
      console.log("Error en getDoctorServices:", err);
      setDoctorServices([]);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);
  
  const fetchDoctorServices = useCallback(() => {
    getDoctorServices(); 
    console.log(doctorServices);
  }, [getDoctorServices, doctorServices]);
  
  return (
    <HospitalContext.Provider
      value={{
        doctors,
        services,
        doctorServices,
        loading,
        error,
        fetchDoctors,
        fetchServices,
        fetchDoctorServices,
        getDoctors
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};
