import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, InputGroup, Table } from 'react-bootstrap';

const ExternalApi = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  const fetchMedicalData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!navigator.onLine) {
        throw new Error('Sin conexión a Internet. Mostrando datos almacenados en caché.');
      }
      
      const response = await fetch('https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=diabetes&df=consumer_name,icd10cm');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      const formattedData = responseData[3].map((item, index) => ({
        id: index + 1,
        name: responseData[3][index][0],
        code: responseData[3][index][1] || 'N/A',
        category: getCategoryFromCode(responseData[3][index][1] || '')
      }));
      
      setData(formattedData);
      setFilteredData(formattedData);
      
      try {
        const db = await openDatabase();
        const tx = db.transaction('medicalData', 'readwrite');
        const store = tx.objectStore('medicalData');
        
        await store.clear();
        
        formattedData.forEach(item => {
          store.add(item);
        });
      } catch (dbError) {
        console.error('Error storing data in IndexedDB:', dbError);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching data:', error);
      
      if (!navigator.onLine) {
        setShowOfflineAlert(true);
        try {
          const offlineData = await getDataFromIndexedDB();
          if (offlineData && offlineData.length > 0) {
            setData(offlineData);
            setFilteredData(offlineData);
          }
        } catch (dbError) {
          console.error('Error retrieving data from IndexedDB:', dbError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('medicalApi', 1);
      
      request.onerror = () => reject(new Error('Error opening database'));
      
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('medicalData')) {
          db.createObjectStore('medicalData', { keyPath: 'id' });
        }
      };
    });
  };

  const getDataFromIndexedDB = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await openDatabase();
        const tx = db.transaction('medicalData', 'readonly');
        const store = tx.objectStore('medicalData');
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Error retrieving data'));
      } catch (error) {
        reject(error);
      }
    });
  };

  const getCategoryFromCode = (code) => {
    if (!code) return 'Otro';
    
    const prefix = code.substring(0, 1);
    
    switch (prefix) {
      case 'A':
      case 'B':
        return 'Infecciosas';
      case 'C':
      case 'D':
        return 'Neoplasias';
      case 'E':
        return 'Endocrinas';
      case 'F':
        return 'Mentales';
      case 'G':
        return 'Nerviosas';
      case 'H':
        return 'Ojos/Oídos';
      case 'I':
        return 'Circulatorias';
      case 'J':
        return 'Respiratorias';
      case 'K':
        return 'Digestivas';
      case 'L':
        return 'Piel';
      case 'M':
        return 'Musculoesqueléticas';
      case 'N':
        return 'Genitourinarias';
      case 'O':
        return 'Embarazo';
      case 'P':
        return 'Perinatales';
      case 'Q':
        return 'Congénitas';
      case 'R':
        return 'Síntomas/Signos';
      case 'S':
      case 'T':
        return 'Traumatismos';
      case 'V':
      case 'W':
      case 'X':
      case 'Y':
        return 'Causas externas';
      case 'Z':
        return 'Factores de salud';
      default:
        return 'Otro';
    }
  };

  useEffect(() => {
    fetchMedicalData();
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleOnlineStatusChange = () => {
    if (navigator.onLine) {
      fetchMedicalData();
      setShowOfflineAlert(false);
    } else {
      setShowOfflineAlert(true);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      let results = [...data];
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        results = results.filter(item => 
          item.name.toLowerCase().includes(searchLower) || 
          item.code.toLowerCase().includes(searchLower)
        );
      }
      
      if (selectedCategory !== 'all') {
        results = results.filter(item => item.category === selectedCategory);
      }
      
      setFilteredData(results);
    }
  }, [searchTerm, selectedCategory, data]);

  const categories = data.length > 0 
    ? ['all', ...new Set(data.map(item => item.category))].sort() 
    : ['all'];

  return (
    <Container className="py-4">
      <h1 className="mb-4">API Médica Externa</h1>
      
      {showOfflineAlert && (
        <Alert variant="warning" className="mb-3">
          <Alert.Heading>Modo sin conexión</Alert.Heading>
          <p>
            Estás viendo datos almacenados en caché. Algunas funciones pueden no estar disponibles.
          </p>
        </Alert>
      )}
      
      {error && error !== 'Sin conexión a Internet. Mostrando datos almacenados en caché.' && (
        <Alert variant="danger" className="mb-3">
          <Alert.Heading>Error al cargar datos</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header as="h5">Datos Médicos de API</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    Limpiar
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categories.filter(cat => cat !== 'all').map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button 
                variant="primary" 
                onClick={fetchMedicalData} 
                disabled={loading}
                className="w-100"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {' '}Cargando...
                  </>
                ) : 'Actualizar'}
              </Button>
            </Col>
          </Row>
          
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
              <p className="mt-2">Cargando datos médicos...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Código ICD-10</th>
                    <th>Categoría</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.code}</td>
                      <td>{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <Alert variant="info" className="text-center">
              No se encontraron resultados.
            </Alert>
          )}
          
          <div className="mt-3 text-muted">
            <small>
              Datos obtenidos de Clinical Tables API del NIH. Esta aplicación almacena los datos en caché para acceso sin conexión.
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExternalApi; 