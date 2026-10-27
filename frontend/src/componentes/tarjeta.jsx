import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap'

function ModuleCard({ titulo, descripcion, icono, textoBoton, onClick }) {
  return (
    <Card className="module-card h-100">
      <CardBody className="d-flex flex-column">
        <div className="module-card-icon mb-3">
          {icono}
        </div>
        <CardTitle tag="h3">{titulo}</CardTitle>

        <CardText>{descripcion}</CardText>

        <Button
          className="mt-auto"
          onClick={onClick}
        >
          {textoBoton}
        </Button>
      </CardBody>
    </Card>
  )
}

const TarjetaSuministro = ({ suministro, onAgregar }) => {
  const estaAgotado = suministro.stock === 0;

  return (
    <Col md="4" xs="12">
      <Card className="mb-3">
        <CardBody>
          <CardTitle tag="h5">{suministro.nombre}</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            {suministro.categoria}
          </CardSubtitle>
          
          <CardText className="mt-3">
            Costo: <Badge color="success">{suministro.precio.toFixed(2)} Cr</Badge>
          </CardText>
          <CardText>
            Stock disponible: {suministro.stock}
          </CardText>

          {estaAgotado ? (
            <Button color="secondary" disabled className="w-100">
              Agotado en Base
            </Button>
          ) : (
            <Button color="primary" className="w-100" onClick={() => onAgregar(suministro.id)}>
              Añadir a la Nave
            </Button>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};


export default ModuleCard