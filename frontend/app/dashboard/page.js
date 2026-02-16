'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) router.push('/')
    else {
      setUser(JSON.parse(userData))
      fetchClients(token)
    }
  }, [])

  const fetchClients = async (token) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/clients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setClients(await res.json())
  }

  const generateAIScript = async () => {
    if (!selectedClient) return
    setLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scripts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ clientData: selectedClient })
    })
    const data = await res.json()
    setScript(data.script)
    setLoading(false)
  }

  const logout = () => {
    localStorage.clear()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">VINSON</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Hola, {user?.username}</span>
            <button onClick={logout} className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Catálogo de Clientes</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {clients.map(client => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-3 border rounded cursor-pointer hover:bg-blue-50 ${
                    selectedClient?.id === client.id ? 'bg-blue-100 border-primary' : ''
                  }`}
                >
                  <p className="font-medium">{client.nombre}</p>
                  <p className="text-sm text-gray-600">Deuda: ${client.deuda?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Generador de Scripts con IA</h2>
            {selectedClient ? (
              <div>
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="font-medium">{selectedClient.nombre}</p>
                  <p className="text-sm text-gray-600">Deuda: ${selectedClient.deuda?.toLocaleString()}</p>
                </div>
                <button
                  onClick={generateAIScript}
                  disabled={loading}
                  className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Generando...' : 'Generar Script con IA'}
                </button>
                {script && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <p className="font-medium mb-2">Script Generado:</p>
                    <p className="text-sm whitespace-pre-wrap">{script}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Selecciona un cliente para generar un script</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
