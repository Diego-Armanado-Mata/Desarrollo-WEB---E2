const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Health check general
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend funcionando correctamente'
  })
})

// Importar rutas modularizadas (sin .routes)
const reactorRoutes = require('./routes/reactor')
const cargaRoutes = require('./routes/carga')

// Montar las rutas en la app
app.use('/', reactorRoutes)      // Mantiene /adjust y /reboot en la raíz
app.use('/api', cargaRoutes)     // Monta /api/inventario, /api/carga, etc.

module.exports = app