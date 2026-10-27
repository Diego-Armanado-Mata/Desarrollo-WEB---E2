
import { useState } from 'react'
import Home from './paginas/Home'
import Reactor from './paginas/Reactor'
import Inventario from './paginas/Inventario'
import './App.css'

function App() {
  const [vista, setVista] = useState('home')

  const volver = () => setVista('home')

  switch (vista) {
    case 'reactor':
      return <Reactor volver={volver} />

    case 'inventario':
      return <Inventario volver={volver} />

    default:
      return <Home navegar={setVista} />
  }
}

export default App
