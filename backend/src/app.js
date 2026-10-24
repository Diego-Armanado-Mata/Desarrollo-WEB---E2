const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

let temperaturaEstabilizacion = generarTemperaturaEstabilizacion()

//funcion que crea la (temperatura de estabilizacion) aleatoria entre 1 y 100
function generarTemperaturaEstabilizacion() {
  return Math.floor(Math.random() * 100) + 1
}

// health check -- posiblemente se puede usar al iniciar la web app
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend funcionando correctamente'
  })
})

//mensaje y casos posibles de la ruta adjust
app.post('/adjust', (req, res) => {
  const temperatura = req.body?.temperatura

  if (!Number.isInteger(temperatura) || temperatura < 1 || temperatura > 100) {
    return res.status(400).json({
      mensaje: 'Ingresa una temperatura entera entre 1 y 100.'
    })
  }

  if (temperatura < temperaturaEstabilizacion) {
    return res.json({
      resultado: 'más alta',
      mensaje: 'La temperatura ideal es más alta.'
    })
  }

  if (temperatura > temperaturaEstabilizacion) {
    return res.json({
      resultado: 'más baja',
      mensaje: 'La temperatura ideal es más baja.'
    })
  }

  return res.json({
    resultado: 'estabilizado',
    mensaje: '¡Reactor estabilizado correctamente!'
  })
})

//ruta para reiniciar el sistema y generar una nueva temperatura de estabilizacion
app.post('/reboot', (req, res) => {
  temperaturaEstabilizacion = generarTemperaturaEstabilizacion()

  res.json({
    mensaje: 'Sistema reiniciado. Intenta estabilizar el reactor nuevamente.'
  })
})

module.exports = app