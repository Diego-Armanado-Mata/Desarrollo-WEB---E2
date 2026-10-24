import { Container, Row, Col } from 'reactstrap'
import ModuleCard from '../componentes/tarjeta'

function Home({ navegar }) {
  return (
    <Container className="py-5">
      <header className="text-center mb-5">
        <h1>Projecto Evaluación 2</h1>
        <p>Selecciona la solución a la que deseas acceder.</p>
      </header>

      <Row className="g-4">
        <Col md="6">
          <ModuleCard
            titulo="Estabiliza el Reactor"
            descripcion="Estabiliza el reactor adivinando la temperatura ideal."
            onClick={() => navegar('moduloUno')}
          />
        </Col>

        <Col md="6">
          <ModuleCard
            titulo="Gestión de Inventario"
            descripcion="Administra el inventario de la nave Capitán."
            onClick={() => navegar('moduloDos')}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Home