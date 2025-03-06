import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert, Spinner } from 'react-bootstrap';

const DeviceAccess = () => {
  const [imageCapture, setImageCapture] = useState(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const [location, setLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        
        const track = mediaStream.getVideoTracks()[0];
        setImageCapture(new ImageCapture(track));
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(`Error al acceder a la cámara: ${error.message}`);
      setStream(null);
      setImageCapture(null);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setImageCapture(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const takePhoto = async () => {
    try {
      if (!imageCapture) {
        throw new Error('Cámara no inicializada');
      }
      
      const blob = await imageCapture.takePhoto();
      const url = URL.createObjectURL(blob);
      setCapturedImage(url);
      
      if (canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
        img.src = url;
      }
    } catch (error) {
      console.error('Error al capturar foto:', error);
      setCameraError(`Error al capturar foto: ${error.message}`);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('La geolocalización no es compatible con este navegador');
      return;
    }
    
    setIsGettingLocation(true);
    setGeoError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        setGeoError(`Error obteniendo ubicación: ${error.message}`);
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Function to calculate distance to hospital (example)
  const getDistanceToHospital = () => {
    if (!location) return null;
    
    // Hospital coordinates (example)
    const hospitalLat = 40.7128;
    const hospitalLng = -74.0060;
    
    // Haversine formula to calculate distance
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(hospitalLat - location.latitude);
    const dLon = deg2rad(hospitalLng - location.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(location.latitude)) * Math.cos(deg2rad(hospitalLat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    
    return distance.toFixed(2);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Acceso a Dispositivos</h1>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h5">Acceso a la Cámara</Card.Header>
            <Card.Body>
              <div className="mb-3">
                <p>Captura imágenes para documentos médicos o identificación.</p>
                
                {cameraError && (
                  <Alert variant="danger">{cameraError}</Alert>
                )}
                
                <div className="text-center mb-3">
                  <video 
                    ref={videoRef} 
                    style={{ 
                      width: '100%', 
                      maxHeight: '300px', 
                      display: stream ? 'block' : 'none',
                      backgroundColor: '#000'
                    }} 
                  />
                  
                  <canvas 
                    ref={canvasRef} 
                    style={{ display: 'none' }} 
                  />
                  
                  {capturedImage && (
                    <div className="mt-3 mb-3">
                      <img 
                        src={capturedImage} 
                        alt="Captured" 
                        style={{ maxWidth: '100%', maxHeight: '200px' }} 
                      />
                    </div>
                  )}
                </div>
                
                <div className="d-grid gap-2">
                  {!stream ? (
                    <Button variant="primary" onClick={startCamera}>
                      Activar Cámara
                    </Button>
                  ) : (
                    <>
                      <Button variant="success" onClick={takePhoto}>
                        Capturar Foto
                      </Button>
                      <Button variant="danger" onClick={stopCamera}>
                        Desactivar Cámara
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {capturedImage && (
                <div className="mt-3">
                  <Form.Group>
                    <Form.Label>Descripción de la imagen</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2} 
                      placeholder="Añadir descripción..." 
                    />
                  </Form.Group>
                  <Button className="mt-2" variant="outline-primary">
                    Guardar en historial médico
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100">
            <Card.Header as="h5">Geolocalización</Card.Header>
            <Card.Body>
              <div className="mb-3">
                <p>Obtén tu ubicación actual para servicios de emergencia o para calcular la distancia al hospital.</p>
                
                {geoError && (
                  <Alert variant="danger">{geoError}</Alert>
                )}
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    onClick={getLocation} 
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        {' '}Obteniendo ubicación...
                      </>
                    ) : 'Obtener mi ubicación'}
                  </Button>
                </div>
                
                {location && (
                  <div className="mt-3">
                    <Alert variant="success">
                      <p className="mb-1"><strong>Ubicación obtenida:</strong></p>
                      <p className="mb-1">Latitud: {location.latitude}</p>
                      <p className="mb-1">Longitud: {location.longitude}</p>
                      <p className="mb-1">Precisión: {location.accuracy} metros</p>
                      
                      {getDistanceToHospital() && (
                        <p className="mt-2 mb-0">
                          <strong>Distancia al hospital:</strong> {getDistanceToHospital()} km
                        </p>
                      )}
                    </Alert>
                    
                    <div className="text-center mt-3">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=40.7128,-74.0060&origin=${location.latitude},${location.longitude}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                      >
                        Ver ruta al hospital
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DeviceAccess; 