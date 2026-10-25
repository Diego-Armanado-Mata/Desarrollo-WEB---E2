const express = require('express')
const router = express.Router()

let temperaturaEstabilizacion = generarTemperaturaEstabilizacion()

// Función que crea la temperatura aleatoria entre 1 y 100
function generarTemperaturaEstabilizacion() {
  return Math.floor(Math.random() * 100) + 1
}

// Ruta POST /adjust
router.post('/adjust', (req, res) => {
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

// Ruta POST /reboot
router.post('/reboot', (req, res) => {
  temperaturaEstabilizacion = generarTemperaturaEstabilizacion()

  res.json({
    mensaje: 'Sistema reiniciado. Intenta estabilizar el reactor nuevamente.'
  })
})

module.exports = router