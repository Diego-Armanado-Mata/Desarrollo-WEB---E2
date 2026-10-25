const express = require('express')
const router = express.Router()

// Simulación de datos en memoria
let inventario = [
  { id: 201, nombre: "Tanque de Oxígeno XL", precio: 50.00, stock: 5, categoria: "Soporte Vital" },
  { id: 202, nombre: "Raciones de Comida", precio: 20.00, stock: 10, categoria: "Sipsum" }
]

let cargaActiva = {
  creditos: 500.00,
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
  // Implementa tu lógica de validación de stock aquí

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


  if (itemInventario.stock < cantidad) {
    return res.status(400).json({ 
      mensaje: "Stock en base insuficiente" 
    });
  }

  const itemEnCarga = cargaActiva.itemsCargados.find(item => item.id === equipoId);

  if (itemEnCarga) {
    // Si ya está en la carga, incrementamos la cantidad
    itemEnCarga.cantidad += cantidad;
  } else {
    // Si no está, lo agregamos como un nuevo objeto a la lista de items cargados
    cargaActiva.itemsCargados.push({
      id: itemInventario.id,
      nombre: itemInventario.nombre,
      precio: itemInventario.precio,
      cantidad: cantidad
    });
  }

  // (Opcional pero recomendado) Descontar el stock temporalmente de la base
  itemInventario.stock -= cantidad;


  res.json({ mensaje: "Suministro agregado temporalmente", cargaActiva })
})

// 4. PUT /api/carga/actualizar-unidades/:id[cite: 3]
router.put('/carga/actualizar-unidades/:id', (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body; // Esta es la nueva cantidad total que el usuario quiere en su bodega

  // 1. Validar que vengan los datos obligatorios y que la cantidad sea válida
  if (!id || cantidad === undefined || cantidad < 0) {
    return res.status(400).json({ 
      mensaje: "Faltan datos requeridos (id o cantidad válida)." 
    });
  }

  // Convertir el id de la URL a número para que coincida con el inventario
  const numericId = Number(id);

  // 2. Buscar el suministro en el inventario general
  const itemInventario = inventario.find(item => item.id === numericId);

  if (!itemInventario) {
    return res.status(404).json({ 
      mensaje: "El suministro no existe en el inventario." 
    });
  }

  // 3. Buscar si el item ya está agregado en la carga activa de la nave
  const itemEnCarga = cargaActiva.itemsCargados.find(item => item.id === numericId);

  // Si no está en la carga pero quieren actualizarlo, podemos manejarlo o asumir que debe existir
  const cantidadAnterior = itemEnCarga ? itemEnCarga.cantidad : 0;

  // 4. VALIDACIÓN DE CRÉDITOS (Requisito del PDF)
  // Calculamos la diferencia de unidades que se están agregando (o restando)
  const diferenciaCantidad = cantidad - cantidadAnterior;
  const costoDiferencia = diferenciaCantidad * itemInventario.precio;

  // Si al subir las unidades el costo total supera los créditos disponibles, respondemos con 400
  // (También puedes evaluar si el costo total de los items supera los créditos iniciales)
  if (costoDiferencia > 0 && costoDiferencia > cargaActiva.creditos) {
    return res.status(400).json({ 
      mensaje: "Creditos insuficientes para esta cantidad" 
    });
  }

  // 5. Actualizar la carga
  if (cantidad === 0) {
    // Si la cantidad es 0, podríamos eliminar el item de la carga
    cargaActiva.itemsCargados = cargaActiva.itemsCargados.filter(item => item.id !== numericId);
  } else if (itemEnCarga) {
    // Actualizamos al nuevo valor absoluto de unidades
    itemEnCarga.cantidad = cantidad;
  } else {
    // Si no estaba y mandan una cantidad mayor a 0, lo agregamos
    cargaActiva.itemsCargados.push({
      id: itemInventario.id,
      nombre: itemInventario.nombre,
      precio: itemInventario.precio,
      cantidad: cantidad
    });
  }

  // 6. Descontar o devolver créditos según el cambio
  cargaActiva.creditos -= costoDiferencia;

  return res.json({ 
    mensaje: "Unidades actualizadas correctamente", 
    cargaActiva 
  });
});



module.exports = router