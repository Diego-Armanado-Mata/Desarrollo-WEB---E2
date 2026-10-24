
import { Container, Button } from 'reactstrap'

function Reactor({ volver }) {
  return (
    <Container className="py-5">
      <Button color="secondary" outline onClick={volver}>
        ← Volver al inicio
      </Button>

      <section className="text-center mt-5">
        <h1>Estabiliza el Reactor</h1>
        <p>
          Adivina la temperatura de estabilización entre 1 y 100.
        </p>

        <div className="game-area mt-4">
          {/* Aqui va el juego */}
        </div>
      </section>
    </Container>
  )
}

export default Reactor
