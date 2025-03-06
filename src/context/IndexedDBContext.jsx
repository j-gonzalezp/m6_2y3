import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { 
  saveToIndexedDB, 
  getFromIndexedDB, 
  deleteFromIndexedDB, 
  clearIndexedDBStore, 
  STORE_NAMES 
} from "../utils/indexedDB";
import { useHospital } from "./HospitalContext";

export const IndexedDBContext = createContext();

export const useIndexedDB = () => {
  const context = useContext(IndexedDBContext);
  if (context === undefined) {
    throw new Error("useIndexedDB must be used within an IndexedDBProvider");
  }
  return context;
};

export const IndexedDBProvider = ({ children }) => {
  const { doctors } = useHospital();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDoctorsFromAPI = useCallback(async () => {
    if (doctors.length === 0) return;
    
    try {
      await saveToIndexedDB(STORE_NAMES.DOCTORS, doctors);
      console.log("Doctors saved to IndexedDB");
    } catch (error) {
      console.error("Error saving doctors to IndexedDB:", error);
    }
  }, [doctors]);

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDoctorsFromAPI();
    }
  }, [doctors, fetchDoctorsFromAPI]);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cachedAppointments = await getFromIndexedDB(STORE_NAMES.APPOINTMENTS);
      const cachedPatients = await getFromIndexedDB(STORE_NAMES.PATIENTS);
      
      if (cachedAppointments) {
        setAppointments(cachedAppointments);
      }
      
      if (cachedPatients) {
        setPatients(cachedPatients);
      }
    } catch (error) {
      setError(`Error loading data from IndexedDB: ${error.message}`);
      console.error("Error loading data from IndexedDB:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const saveAppointment = useCallback(async (appointment) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!appointment.id) {
        appointment.id = Date.now().toString();
      }
      
      const result = await saveToIndexedDB(STORE_NAMES.APPOINTMENTS, appointment);
      
      if (result) {
        setAppointments(prev => {
          const existingIndex = prev.findIndex(a => a.id === appointment.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = appointment;
            return updated;
          } else {
            return [...prev, appointment];
          }
        });
      }
      
      return result;
    } catch (error) {
      setError(`Error saving appointment: ${error.message}`);
      console.error("Error saving appointment:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const savePatient = useCallback(async (patient) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!patient.id) {
        patient.id = Date.now().toString();
      }
      
      const result = await saveToIndexedDB(STORE_NAMES.PATIENTS, patient);
      
      if (result) {
        setPatients(prev => {
          const existingIndex = prev.findIndex(p => p.id === patient.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = patient;
            return updated;
          } else {
            return [...prev, patient];
          }
        });
      }
      
      return result;
    } catch (error) {
      setError(`Error saving patient: ${error.message}`);
      console.error("Error saving patient:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAppointment = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await deleteFromIndexedDB(STORE_NAMES.APPOINTMENTS, id);
      
      if (result) {
        setAppointments(prev => prev.filter(a => a.id !== id));
      }
      
      return result;
    } catch (error) {
      setError(`Error deleting appointment: ${error.message}`);
      console.error("Error deleting appointment:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await clearIndexedDBStore(STORE_NAMES.APPOINTMENTS);
      
      if (result) {
        setAppointments([]);
      }
      
      return result;
    } catch (error) {
      setError(`Error clearing appointments: ${error.message}`);
      console.error("Error clearing appointments:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <IndexedDBContext.Provider
      value={{
        appointments,
        patients,
        doctors,
        loading,
        error,
        saveAppointment,
        savePatient,
        deleteAppointment,
        clearAppointments,
        fetchDoctorsFromAPI
      }}
    >
      {children}
    </IndexedDBContext.Provider>
  );
}; 