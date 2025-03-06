const DB_NAME = 'hospitalDB';
const DB_VERSION = 1;
const STORES = {
  APPOINTMENTS: 'appointments',
  DOCTORS: 'doctors',
  PATIENTS: 'patients'
};

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.error}`);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORES.APPOINTMENTS)) {
        const appointmentStore = db.createObjectStore(STORES.APPOINTMENTS, { keyPath: 'id' });
        appointmentStore.createIndex('patientId', 'patientId', { unique: false });
        appointmentStore.createIndex('doctorId', 'doctorId', { unique: false });
        appointmentStore.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.DOCTORS)) {
        const doctorStore = db.createObjectStore(STORES.DOCTORS, { keyPath: 'id' });
        doctorStore.createIndex('specialty', 'specialty', { unique: false });
        doctorStore.createIndex('name', 'name', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PATIENTS)) {
        const patientStore = db.createObjectStore(STORES.PATIENTS, { keyPath: 'id' });
        patientStore.createIndex('name', 'name', { unique: false });
        patientStore.createIndex('email', 'email', { unique: true });
      }
    };
  });
};

export const saveToIndexedDB = async (storeName, data) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = Array.isArray(data) 
        ? Promise.all(data.map(item => {
            return new Promise((res, rej) => {
              const req = store.put(item);
              req.onsuccess = () => res(req.result);
              req.onerror = () => rej(req.error);
            });
          }))
        : new Promise((res, rej) => {
            const req = store.put(data);
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
          });
      
      transaction.oncomplete = () => {
        resolve(true);
      };
      
      transaction.onerror = (event) => {
        reject(`Error in transaction: ${event.target.error}`);
      };
      
      return request;
    });
  } catch (error) {
    console.error(`Error saving to IndexedDB (${storeName}):`, error);
    return false;
  }
};

export const getFromIndexedDB = async (storeName, key = null) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request;
      if (key) {
        request = store.get(key);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(`Error retrieving data: ${request.error}`);
      };
    });
  } catch (error) {
    console.error(`Error getting from IndexedDB (${storeName}):`, error);
    return null;
  }
};

export const deleteFromIndexedDB = async (storeName, key) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.delete(key);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = () => {
        reject(`Error deleting data: ${request.error}`);
      };
    });
  } catch (error) {
    console.error(`Error deleting from IndexedDB (${storeName}):`, error);
    return false;
  }
};

export const clearIndexedDBStore = async (storeName) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = () => {
        reject(`Error clearing store: ${request.error}`);
      };
    });
  } catch (error) {
    console.error(`Error clearing IndexedDB store (${storeName}):`, error);
    return false;
  }
};

export const STORE_NAMES = STORES; 