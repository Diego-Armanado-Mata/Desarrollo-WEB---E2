import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap'

function ModuleCard({ titulo, descripcion, onClick }) {
  return (
    <Card className="module-card h-100">
      <CardBody className="d-flex flex-column">
        <CardTitle tag="h3">{titulo}</CardTitle>

        <CardText>{descripcion}</CardText>

        <Button
          color="primary"
          className="mt-auto"
          onClick={onClick}
        >
          Ingresar
        </Button>
      </CardBody>
    </Card>
  )
}

export default ModuleCard