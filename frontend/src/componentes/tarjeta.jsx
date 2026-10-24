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

export default ModuleCard