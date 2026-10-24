
import { useState } from 'react'
import { Container, Button, Form, FormGroup, Label } from 'reactstrap'
import SusBtn from '../componentes/susBtn'

function Reactor({ volver }) {
  const [temperatura, setTemperatura] = useState('')
  const [historial, setHistorial] = useState([])
  const [advertencia, setAdvertencia] = useState('')
  const [estabilizado, setEstabilizado] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const enviarAjuste = async (event) => {
    event.preventDefault()

    const intento = Number(temperatura)
    setHistorial((intentos) => [...intentos, intento])
    setAdvertencia('')
    setProcesando(true)

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/adjust`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ temperatura: intento })
        }
      )
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo ajustar la temperatura.')
      }

      setAdvertencia(datos.mensaje)
      setEstabilizado(datos.resultado === 'estabilizado')
    } catch (error) {
      setAdvertencia(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el servidor.'
      )
    } finally {
      setProcesando(false)
    }
  }

  const reiniciar = async () => {
    setProcesando(true)
    setAdvertencia('')

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reboot`,
        { method: 'POST' }
      )
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo reiniciar el sistema.')
      }

      setTemperatura('')
      setHistorial([])
      setEstabilizado(false)
      setAdvertencia(datos.mensaje)
    } catch (error) {
      setAdvertencia(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el servidor.'
      )
    } finally {
      setProcesando(false)
    }
  }

  return (
    <Container className="py-5">
      <Button outline onClick={volver}>
        ← Volver al inicio
      </Button>

      <section className="text-center mt-5">
        <h1>Estabiliza el Reactor</h1>
        <p>
          Adivina la temperatura de estabilización entre 1 y 100.
        </p>

        <div className="game-area mt-4">
          <Form className="reactor-form text-start" onSubmit={enviarAjuste}>
            <FormGroup>
              <Label for="temperatura">Temperatura del reactor (1-100)</Label>
              <SusBtn
                id="temperatura"
                value={temperatura}
                onChange={setTemperatura}
                disabled={estabilizado || procesando}
              />
            </FormGroup>

            <div className="d-flex gap-2">
              <Button
                className="reactor-button"
                type="submit"
                disabled={estabilizado || procesando}
              >
                {procesando ? 'Procesando...' : 'Ajustar temperatura'}
              </Button>
              <Button
                color="secondary"
                type="button"
                onClick={reiniciar}
                disabled={procesando}
              >
                Reiniciar
              </Button>
            </div>
          </Form>

          {advertencia && (
            <p
              className={`reactor-message mt-4${estabilizado ? ' success' : ''}`}
              role="status"
              aria-live="polite"
            >
              {advertencia}
            </p>
          )}

          {historial.length > 0 && (
            <section className="reactor-history mt-4 text-start">
              <h2 className="h5">Historial de temperaturas</h2>
              <ol className="mb-0">
                {historial.map((intento, indice) => (
                  <li key={`${indice}-${intento}`}>
                    Intento {indice + 1}: {intento} °C
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </section>
    </Container>
  )
}

export default Reactor
