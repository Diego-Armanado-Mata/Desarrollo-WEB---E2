import { Button, Input, InputGroup } from 'reactstrap'

function SusBtn({ id, value, onChange, disabled }) {
  const ajustarTemperatura = (cantidad) => {
    const valorActual = Number(value) || 0
    const nuevoValor = Math.min(100, Math.max(1, valorActual + cantidad))
    onChange(String(nuevoValor))
  }

  return (
    <InputGroup className="sus-input-group">
      <Input
        id={id}
        className="sus-input"
        type="number"
        min="1"
        max="100"
        step="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        disabled={disabled}
      />
      <div className="sus-input-controls">
        <Button
          className="sus-input-button sus-input-button-up"
          type="button"
          aria-label="Aumentar temperatura"
          onClick={() => ajustarTemperatura(1)}
          disabled={disabled || Number(value) >= 100}
        >
          ▲
        </Button>
        <Button
          className="sus-input-button sus-input-button-down"
          type="button"
          aria-label="Disminuir temperatura"
          onClick={() => ajustarTemperatura(-1)}
          disabled={disabled || Number(value) <= 1}
        >
          ▼
        </Button>
      </div>
    </InputGroup>
  )
}

export default SusBtn
