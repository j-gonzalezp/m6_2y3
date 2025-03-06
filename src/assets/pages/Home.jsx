import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Profiler } from "react";
import { useHospital } from "../../context/HospitalContext";
import ServiceList from "../../components/ServiceList";

const Home = () => {
  const { doctors, services, error, fetchDoctors, fetchServices, loading } = useHospital();

  useEffect(() => {
    fetchDoctors(); // Cargar doctores
    fetchServices(); // Cargar servicios
  }, []); // Se ejecuta solo una vez

  if (loading) {
    return <p>Cargando información...</p>;
  }

  const onRenderCallback = (id, phase, actualDuration) => {
    console.log(`Profiler [${id}] - ${phase} - ${actualDuration}ms`);
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <header className="text-center py-4">
            <h1>Hospital Central</h1>
            <p className="text-muted">Cuidamos de ti y de los tuyos con excelencia médica desde 1990.</p>
          </header>
        </Col>
      </Row>

      <Row>
        {/* Información principal del hospital */}
        <Col md={8}>
          <Profiler id="ServiceList" onRender={onRenderCallback}>
            <section className="services-section mb-4">
              <h2 className="mb-3">Nuestros Servicios</h2>
              <ServiceList services={services} />
            </section>
          </Profiler>
        </Col>

        {/* Barra lateral con información adicional */}
        <Col md={4}>
          <Profiler id="HospitalInfo" onRender={onRenderCallback}>
            <aside>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Sobre Nosotros</Card.Title>
                  <Card.Text>
                    Somos un hospital comprometido con la atención de calidad, combinando innovación, tecnología, y un equipo humano altamente capacitado.
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Nuestros Valores</Card.Title>
                  <ul>
                    <li>Compromiso con el paciente</li>
                    <li>Innovación constante</li>
                    <li>Ética profesional</li>
                    <li>Empatía y respeto</li>
                  </ul>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Contáctanos</Card.Title>
                  <Card.Text>
                    <strong>Teléfono:</strong> +56 123 456 789<br />
                    <strong>Email:</strong> contacto@hospital.com<br />
                  </Card.Text>
                  <div>
                    <strong>Redes Sociales:</strong>
                    <ul>
                      <li><a href="#">Facebook</a></li>
                      <li><a href="#">Twitter</a></li>
                      <li><a href="#">Instagram</a></li>
                    </ul>
                  </div>
                </Card.Body>

              </Card>

              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Contáctanos</Card.Title>
                  <Card.Text>
                    <strong>Teléfono:</strong> +56 123 456 789<br />
                    <strong>Email:</strong> contacto@hospital.com<br />
                  </Card.Text>
                  <div>
                    <strong>Redes Sociales:</strong>
                    <ul>
                      <li><a href="#">Facebook</a></li>
                      <li><a href="#">Twitter</a></li>
                      <li><a href="#">Instagram</a></li>
                    </ul>
                  </div>
                </Card.Body>

              </Card>
            </aside>
          </Profiler>
        </Col>
      </Row>


    </Container>
  );
};

export default Home;
