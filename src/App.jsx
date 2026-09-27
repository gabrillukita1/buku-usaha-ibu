import { useState } from 'react'
import Header from './components/Header.jsx'
import BrambangModule from './modules/BrambangModule.jsx'
import SupplierModule from './modules/SupplierModule.jsx'

export default function App() {
  const [moduleId, setModuleId] = useState('bg')

  return (
    <div className={`app mod-${moduleId}`}>
      <Header moduleId={moduleId} onSwitch={setModuleId} />
      <main className="main">
        {moduleId === 'bg' ? <BrambangModule /> : <SupplierModule />}
      </main>
    </div>
  )
}
