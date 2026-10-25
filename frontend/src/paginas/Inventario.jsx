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

const PanelSuperior = ({ creditosDisponibles, costoTotalCarga, mensajeError }) => {
  return (
    <div className="panel-superior sticky-top mb-4">
      
      {mensajeError && (
        <UncontrolledAlert color="warning">
          {mensajeError}
        </UncontrolledAlert>
      )}

      <Alert color="info" className="d-flex justify-content-between align-items-center mb-0">
        <h5 className="mb-0">AstroLogistics Ltd. - Manifiesto de Viaje</h5>
        
        <div className="d-flex align-items-center">
          <span className="me-4 fw-bold">
            Créditos disponibles: {creditosDisponibles} Cr
          </span>
          <span className="fw-bold">
            Costo total de Carga: {' '}
            <Badge color="dark" pill>
              {costoTotalCarga} Cr
            </Badge>
          </span>
        </div>
      </Alert>
      
    </div>
  );
};

export default Inventario
