//pagina solo para probar el inventario, quitenla si quieren

import { Container, Button } from 'reactstrap'

function Inventario({ volver }) {
  return (
    <Container className="py-5">
      <Button color="secondary" outline onClick={volver}>
        ← Volver al inicio
      </Button>

      <section className="text-center mt-5">
        <h1>Gestión de inventario</h1>
        <p>Este módulo será implementado por el equipo.</p>
      </section>
    </Container>
  )
}

export default Inventario
