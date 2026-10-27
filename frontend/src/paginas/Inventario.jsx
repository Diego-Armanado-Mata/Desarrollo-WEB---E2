import React, { useState, useEffect } from 'react';
import {
  Container, Button, Row, Col, Card, CardBody,
  CardTitle, CardText, Badge, ListGroup,
  ListGroupItem, ButtonGroup, Alert, UncontrolledAlert
} from 'reactstrap';

import { obtenerInventario } from '../servicios/api';

const PanelSuperior = ({ creditosDisponibles, costoTotalCarga, mensajeError, tiempoRestante }) => {
  const formatoTiempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="panel-superior sticky-top mb-4 mt-3">
      {mensajeError && (
        <UncontrolledAlert color="warning">
          {mensajeError}
        </UncontrolledAlert>
      )}
      <Alert color="info" className="d-flex justify-content-between align-items-center mb-0">
        <h5 className="mb-0">AstroLogistics Ltd. - Manifiesto de Viaje</h5>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-bold text-danger">
            ⏱️ Tiempo: {formatoTiempo(tiempoRestante)}
          </span>
          <span className="fw-bold">
            Créditos: {creditosDisponibles} Cr
          </span>
          <span className="fw-bold">
            Costo Carga: {' '}
            <Badge color="dark" pill>
              {costoTotalCarga} Cr
            </Badge>
          </span>
        </div>
      </Alert>
    </div>
  );
};

function Inventario({ volver }) {
  const [inventario, setInventario] = useState([]);
  const [carga, setCarga] = useState([]);
  const [creditos, setCreditos] = useState(0);
  const [costoTotal, setCostoTotal] = useState(0);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [itemProcesando, setItemProcesando] = useState(null);

  // 1. NUEVOS ESTADOS PARA LAS 2 CARACTERÍSTICAS FALTANTES
  const [tiempoRestante, setTiempoRestante] = useState(180); // 3 minutos de ventana de lanzamiento
  const [sesionExpirada, setSesionExpirada] = useState(false);
  const [manifiestoConfirmado, setManifiestoConfirmado] = useState(false);

const reiniciarMisionYVolver = async () => {
  try {
    await fetch('http://localhost:3000/api/carga/reiniciar', {
      method: 'POST'
    });
  } catch (err) {
    console.error("Error al reiniciar la misión en el servidor:", err);
  }
  // Llamas a la función original de props para salir
  volver(); 
};

  useEffect(() => {
    cargarDatos();
  }, []);

  // 2. EFECTO PARA EL LÍMITE DE TIEMPO DE LANZAMIENTO (Cierra sesión al terminar)
  useEffect(() => {
    if (sesionExpirada || manifiestoConfirmado) return;

    if (tiempoRestante <= 0) {
      setSesionExpirada(true);
      setError("¡Ventana de lanzamiento expirada! La sesión se ha cerrado. Por favor, reinicia.");
      return;
    }

    const timer = setInterval(() => {
      setTiempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempoRestante, sesionExpirada, manifiestoConfirmado]);

  const cargarDatos = async () => {
    try {
      const [dataInv, resCarga] = await Promise.all([
        obtenerInventario(),
        fetch('http://localhost:3000/api/carga')
      ]);

      if (!resCarga.ok) {
        throw new Error("No se pudo obtener la carga");
      }

      const dataCarga = await resCarga.json();
      setInventario(dataInv);
      setCarga(dataCarga.itemsCargados);
      setCreditos(dataCarga.creditos);
      setCostoTotal(dataCarga.total);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err.message);
    }
  };

  const agregarAlManifiesto = async (equipoId) => {
    if (procesando || sesionExpirada || manifiestoConfirmado) return;

    setError(null);
    setProcesando(true);
    try {
      const response = await fetch('http://localhost:3000/api/carga/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipoId, cantidad: 1 })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.mensaje || "Error al agregar stock");
      }
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  const modificarUnidades = async (id, nuevaCantidad) => {
    if (nuevaCantidad < 1 || sesionExpirada || manifiestoConfirmado) return;
    setError(null);

    if (procesando) return;
    setProcesando(true);
    setItemProcesando(id);

    try {
      const response = await fetch(
        `http://localhost:3000/api/carga/actualizar-unidades/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cantidad: nuevaCantidad })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.mensaje || "Créditos insuficientes");
      }
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
      setItemProcesando(null);
    }
  };

  const desembarcar = async (id) => {
    if (procesando || sesionExpirada || manifiestoConfirmado) return;

    setError(null);
    setProcesando(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/carga/eliminar/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const datosError = await response.json();
        throw new Error(datosError.error || "Error al desembarcar");
      }

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  // 3. FUNCIÓN PARA CONFIRMAR EL EQUIPAMIENTO
  const confirmarEquipamiento = () => {
    if (carga.length === 0) {
      setError("El manifiesto está vacío. Agrega suministros antes de confirmar.");
      return;
    }
    setManifiestoConfirmado(true);
    setError(null);
  };

  return (
    <Container className="py-4">
      <Button color="secondary" outline onClick={reiniciarMisionYVolver} className="mb-3">
        ← Volver al inicio
      </Button>

      <PanelSuperior
        creditosDisponibles={creditos}
        costoTotalCarga={costoTotal}
        mensajeError={error}
        tiempoRestante={tiempoRestante}
      />

      {/* Pantalla si la sesión expira o el manifiesto es confirmado */}
      {manifiestoConfirmado && (
        <Alert color="success" className="text-center py-4">
          <h4>¡Manifiesto de Equipamiento Confirmado con Éxito!</h4>
          <p>El transbordador está listo para el lanzamiento. Stock bloqueado correctamente.</p>
          <Button color="primary" onClick={reiniciarMisionYVolver}>Finalizar Misión</Button>
        </Alert>
      )}

      {!manifiestoConfirmado && (
        <Row className="mt-4">
          <Col md="8">
            <h4 className="mb-3">Catálogo de Suministros</h4>
            <Row>
              {inventario.map((item) => (
                <Col md="4" xs="12" key={item.id}>
                  <Card className="mb-3 shadow-sm">
                    <CardBody>
                      <CardTitle tag="h6" className="fw-bold">{item.nombre}</CardTitle>
                      <CardText className="text-muted small mb-2">{item.categoria}</CardText>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Badge color="success">${item.precio} Cr</Badge>
                        <span className="small fw-bold">Stock: {item.stock}</span>
                      </div>
                      {item.stock === 0 || sesionExpirada ? (
                        <Button color="secondary" disabled className="w-100">
                          {sesionExpirada ? "Sesión Cerrada" : "Agotado en Base"}
                        </Button>
                      ) : (
                        <Button 
                          color="primary" 
                          className="w-100" 
                          disabled={procesando || sesionExpirada} 
                          onClick={() => agregarAlManifiesto(item.id)}
                        >
                          Añadir a la Nave
                        </Button>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          <Col md="4">
            <h4 className="mb-3">Tu Bodega de Carga</h4>
            <Card className="shadow-sm">
              <ListGroup flush>
                {carga.length === 0 ? (
                  <ListGroupItem className="text-center text-muted py-4">
                    El manifiesto está vacío.
                  </ListGroupItem>
                ) : (
                  carga.map((item) => (
                    <ListGroupItem key={item.id} className="d-flex flex-column gap-2">
                      <div className="d-flex justify-content-between fw-bold">
                        <span>{item.nombre || `Item ${item.id}`}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        {procesando && itemProcesando === item.id && (
                          <span className="text-warning small">Calculando peso...</span>
                        )}

                        <ButtonGroup size="sm">
                          <Button
                            color="secondary"
                            outline
                            disabled={procesando || sesionExpirada || item.cantidad <= 1}
                            onClick={() => modificarUnidades(item.id, item.cantidad - 1)}
                          >
                            -
                          </Button>
                          <Button color="secondary" disabled>
                            {item.cantidad}
                          </Button>
                          <Button
                            color="secondary"
                            outline
                            disabled={procesando || sesionExpirada}
                            onClick={() => modificarUnidades(item.id, item.cantidad + 1)}
                          >
                            +
                          </Button>
                        </ButtonGroup>

                        <Button 
                          color="danger" 
                          outline 
                          size="sm" 
                          disabled={procesando || sesionExpirada} 
                          onClick={() => desembarcar(item.id)}
                        >
                          Desembarcar
                        </Button>
                      </div>
                    </ListGroupItem>
                  ))
                )}
              </ListGroup>
            </Card>

            {/* 4. BOTÓN DE CONFIRMACIÓN FINAL */}
            {carga.length > 0 && !sesionExpirada && (
              <Button 
                color="success" 
                className="w-100 mt-3 py-2 fw-bold" 
                onClick={confirmarEquipamiento}
              >
                Confirmar Equipamiento y Lanzar 🚀
              </Button>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Inventario;