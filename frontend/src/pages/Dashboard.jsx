import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [selectedClient, setSelectedClient] = useState(null)
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Datos de ejemplo
  const clients = [
    { id: 1, nombre: 'Cliente Demo 1', deuda: 150000 },
    { id: 2, nombre: 'Cliente Demo 2', deuda: 250000 },
    { id: 3, nombre: 'Cliente Demo 3', deuda: 100000 },
  ]

  const generateAIScript = () => {
    if (!selectedClient) return
    setLoading(true)
    // Simulación de generación de script
    setTimeout(() => {
      setScript(`Buenos días, le hablo de Vinson AI Cobranza. Tengo registro de una deuda pendiente de $${selectedClient.deuda.toLocaleString()}. ¿Podríamos coordinar el pago?`)
      setLoading(false)
    }, 1500)
  }

  const logout = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">VINSON</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Salir
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Catálogo de Clientes</h2>
            <div className="space-y-2">
              {clients.map(client => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-4 border rounded cursor-pointer hover:bg-blue-50 ${
                    selectedClient?.id === client.id ? 'bg-blue-100 border-blue-500' : 'bg-white'
                  }`}
                >
                  <div className="font-semibold">{client.nombre}</div>
                  <div className="text-sm text-gray-600">Deuda: ${client.deuda.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Generador de Scripts con IA</h2>
            {selectedClient ? (
              <div className="bg-white p-4 rounded border">
                <div className="mb-4">
                  <div className="font-semibold">{selectedClient.nombre}</div>
                  <div className="text-sm text-gray-600">Deuda: ${selectedClient.deuda.toLocaleString()}</div>
                </div>
                <button
                  onClick={generateAIScript}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {loading ? 'Generando...' : 'Generar Script con IA'}
                </button>
                {script && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <div className="font-semibold mb-2">Script Generado:</div>
                    <p className="text-sm">{script}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-4 rounded border text-center text-gray-500">
                Selecciona un cliente para generar un script
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
