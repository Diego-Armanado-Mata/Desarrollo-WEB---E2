
import { Container, Row, Col } from 'reactstrap'
import ModuleCard from '../componentes/tarjeta'

function Home({ navegar }) {
  return (
    <Container className="home-container py-5">
      <header className="text-center mb-5">
        <h1>Centro de operaciones</h1>
        <p>Selecciona el módulo con el que deseas trabajar.</p>
      </header>

      <Row className="g-4">
        <Col xs="12" md="6">
          <ModuleCard
            titulo="Estabiliza el Reactor"
            descripcion="Estabiliza el reactor adivinando la temperatura entre 1 y 100."
            icono="🌡️"
            textoBoton="Abrir módulo de temperatura"
            onClick={() => navegar('reactor')}
          />
        </Col>

        <Col xs="12" md="6">
          <ModuleCard
            titulo="Gestión de inventario"
            descripcion="Administra los productos del inventario de la nave."
            icono="📦"
            textoBoton="Abrir módulo de inventario"
            onClick={() => navegar('inventario')}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Home
