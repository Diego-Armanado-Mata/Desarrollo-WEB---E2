import { useState } from 'react'
import Home from './paginas/Home'
import './App.css'

function App() {
  const [vista, setVista] = useState('home')

  if (vista === 'moduloUno') {
    return (
      <main>
        <button onClick={() => setVista('home')}>
          Volver al inicio
        </button>
        <h1>Módulo uno</h1>
      </main>
    )
  }

  if (vista === 'moduloDos') {
    return (
      <main>
        <button onClick={() => setVista('home')}>
          Volver al inicio
        </button>
        <h1>Módulo dos</h1>
      </main>
    )
  }

  return <Home navegar={setVista} />
}

export default App