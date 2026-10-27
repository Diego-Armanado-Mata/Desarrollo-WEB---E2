const express = require('express')
const router = express.Router()

// Simulación de datos en memoria
let inventario = [
  { id: 201, nombre: "Tanque de Oxígeno XL", precio: 50.00, stock: 5, categoria: "Soporte Vital" },
  { id: 202, nombre: "Raciones de Comida", precio: 20.00, stock: 10, categoria: "Sipsum" }
]

let cargaActiva = {
  creditos: 500.00,
  total: 0,
  itemsCargados: []
}

// 1. GET /api/inventario[cite: 2, 3]
router.get('/inventario', (req, res) => {
  res.json(inventario)
})

// 2. GET /api/carga[cite: 3]
router.get('/carga', (req, res) => {
  res.json(cargaActiva)
})

// 3. POST /api/carga/agregar[cite: 3]
router.post('/carga/agregar', (req, res) => {
  const { equipoId, cantidad } = req.body

  if (!equipoId || !cantidad || cantidad <= 0) {
    return res.status(400).json({
      mensaje: "Faltan datos requeridos (equipoId o cantidad válida)."
    });
  }

  const itemInventario = inventario.find(item => item.id === equipoId);

  if (!itemInventario) {
    return res.status(404).json({
      mensaje: "El suministro no existe en el inventario."
    });
  }

  // Validación de stock en base[cite: 3]
  if (itemInventario.stock < cantidad) {
    return res.status(400).json({
      mensaje: "Stock en base insuficiente"
    });
  }

  //VErificar si hay suficientes créditos antes de agregar
  const costoTotalItem = itemInventario.precio * cantidad;
  if (costoTotalItem > cargaActiva.creditos) {
    return res.status(400).json({
      mensaje: "Creditos insuficientes para esta cantidad"
    });
  }

  const itemEnCarga = cargaActiva.itemsCargados.find(item => item.id === equipoId);

  if (itemEnCarga) {
    itemEnCarga.cantidad += cantidad;
  } else {
    cargaActiva.itemsCargados.push({
      id: itemInventario.id,
      nombre: itemInventario.nombre,
      precio: itemInventario.precio,
      cantidad: cantidad
    });
  }

  itemInventario.stock -= cantidad;
  cargaActiva.creditos -= costoTotalItem;
  cargaActiva.total += costoTotalItem;

  res.json({ mensaje: "Suministro agregado temporalmente", cargaActiva })
})

// CORRECCIÓN: Ruta DELETE ajustada a /carga/eliminar/:id
router.delete('/carga/eliminar/:id', (req, res) => {
  const idSuministro = parseInt(req.params.id);

  const indexEnCarga = cargaActiva.itemsCargados.findIndex(item => item.id === idSuministro);

  if (indexEnCarga === -1) {
    return res.status(404).json({ error: "El suministro no está cargado" });
  }

  const itemAEliminar = cargaActiva.itemsCargados[indexEnCarga];
  const itemEnInventario = inventario.find(item => item.id === idSuministro);

  if (itemEnInventario) {
    itemEnInventario.stock += itemAEliminar.cantidad;
  }

  const costoReembolso = itemAEliminar.precio * itemAEliminar.cantidad;

  cargaActiva.creditos += costoReembolso;
  cargaActiva.total -= costoReembolso;

  cargaActiva.itemsCargados.splice(indexEnCarga, 1);

  res.json({
    mensaje: "Suministro eliminado correctamente",
    cargaActualizada: cargaActiva
  });
});

// 4. PUT /api/carga/actualizar-unidades/:id[cite: 3]
router.put('/carga/actualizar-unidades/:id', (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body; 

  if (!id || cantidad === undefined || cantidad < 0) {
    return res.status(400).json({
      mensaje: "Faltan datos requeridos (id o cantidad válida)."
    });
  }

  const numericId = Number(id);
  const itemInventario = inventario.find(item => item.id === numericId);

  if (!itemInventario) {
    return res.status(404).json({
      mensaje: "El suministro no existe en el inventario."
    });
  }

  const itemEnCarga = cargaActiva.itemsCargados.find(item => item.id === numericId);
  const cantidadAnterior = itemEnCarga ? itemEnCarga.cantidad : 0;

  const diferenciaCantidad = cantidad - cantidadAnterior;
  const costoDiferencia = diferenciaCantidad * itemInventario.precio;

  if (diferenciaCantidad > itemInventario.stock) {
    return res.status(400).json({
      mensaje: "Stock insuficiente en la base"
    });
  }

  if (costoDiferencia > 0 && costoDiferencia > cargaActiva.creditos) {
    return res.status(400).json({
      mensaje: "Creditos insuficientes para esta cantidad"
    });
  }

  if (cantidad === 0) {
    cargaActiva.itemsCargados = cargaActiva.itemsCargados.filter(item => item.id !== numericId);
  } else if (itemEnCarga) {
    itemEnCarga.cantidad = cantidad;
  } else {
    cargaActiva.itemsCargados.push({
      id: itemInventario.id,
      nombre: itemInventario.nombre,
      precio: itemInventario.precio,
      cantidad: cantidad
    });
  }

  cargaActiva.creditos -= costoDiferencia;
  itemInventario.stock -= diferenciaCantidad;
  cargaActiva.total += costoDiferencia;

  return res.json({
    mensaje: "Unidades actualizadas correctamente",
    cargaActiva
  });
});

module.exports = router