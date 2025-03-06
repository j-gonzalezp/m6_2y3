import React, { useEffect, useState } from "react";
import DoctorCard from "../../components/DoctorCard";
import { useHospital } from "../../context/HospitalContext";
import withModal from "../../components/shared/withModal";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import DetailModal from "../../components/DetailModal";
import { Profiler } from "react";

const DoctorCardWithModal = withModal(DoctorCard, DetailModal);

const Team = () => {
  const { doctors, getDoctors, loading, error } = useHospital();
  const [retryCount, setRetryCount] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!initialLoadDone || retryCount > 0) {
        try {
          await getDoctors();
          if (isMounted) {
            setInitialLoadDone(true);
          }
        } catch (err) {
          console.error("Error fetching doctors in Team component:", err);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [getDoctors, retryCount, initialLoadDone]);

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  return (
    <Container>
      <h1 className="my-4">Lista de Doctores</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button onClick={handleRetry} variant="outline-danger">
              Reintentar
            </Button>
          </div>
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando información de los doctores...</p>
        </div>
      ) : (
        <Profiler id="doctor-list">
          {doctors && doctors.length > 0 ? (
            <Row>
              {doctors.map((doctor) => (
                <Col key={doctor.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <DoctorCardWithModal doctor={doctor} data={doctor} />
                </Col>
              ))}
            </Row>
          ) : !loading && !error ? (
            <Alert variant="info">
              No hay doctores disponibles en este momento.
            </Alert>
          ) : null}
        </Profiler>
      )}
    </Container>
  );
};

export default Team;
