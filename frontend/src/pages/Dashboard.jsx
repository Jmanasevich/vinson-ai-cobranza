import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://vinson-ai-cobranza-backend.vercel.app'

function Dashboard() {
  const navigate = useNavigate()
  const [selectedClient, setSelectedClient] = useState(null)
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('clientes')

  const clients = [
    { id: 1, nombre: 'Juan Perez', rut: '12.345.678-9', deuda: 150000, dias: 45, estado: 'Pendiente' },
    { id: 2, nombre: 'Maria Gonzalez', rut: '9.876.543-2', deuda: 250000, dias: 90, estado: 'Urgente' },
    { id: 3, nombre: 'Carlos Rojas', rut: '15.432.198-K', deuda: 100000, dias: 15, estado: 'Nuevo' },
    { id: 4, nombre: 'Ana Torres', rut: '11.222.333-4', deuda: 380000, dias: 120, estado: 'Urgente' },
    { id: 5, nombre: 'Luis Silva', rut: '8.765.432-1', deuda: 75000, dias: 30, estado: 'Pendiente' },
  ]

  const estadoColor = (estado) => {
    if (estado === 'Urgente') return 'bg-red-100 text-red-700'
    if (estado === 'Pendiente') return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const generateAIScript = async () => {
    if (!selectedClient) return
    setLoading(true)
    setScript('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/generate-script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente: selectedClient })
      })
      const data = await res.json()
      setScript(data.script || data.message || 'Script generado correctamente.')
    } catch (e) {
      setScript(`Buenos dias, le contacto de Vinson AI Cobranza. Tenemos registrada una deuda de $${selectedClient.deuda.toLocaleString('es-CL')} con ${selectedClient.dias} dias de atraso. Podriamos coordinar el pago hoy?`)
    }
    setLoading(false)
  }

  const totalDeuda = clients.reduce((sum, c) => sum + c.deuda, 0)
  const urgentes = clients.filter(c => c.estado === 'Urgente').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-3">
          <span className="font-black text-xl bg-white text-blue-700 px-3 py-1 rounded-lg">VINSON</span>
          <span className="text-blue-200 text-sm">Sistema de Cobranza con IA</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
        >
          Cerrar sesion
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Total Cartera</p>
            <p className="text-2xl font-bold text-gray-800">${totalDeuda.toLocaleString('es-CL')}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Clientes Activos</p>
            <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-5 shadow-sm border border-red-100">
            <p className="text-red-500 text-sm">Casos Urgentes</p>
            <p className="text-2xl font-bold text-red-700">{urgentes}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de clientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Cartera de Clientes</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {clients.map(client => (
                <div
                  key={client.id}
                  onClick={() => { setSelectedClient(client); setScript('') }}
                  className={`px-5 py-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedClient?.id === client.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{client.nombre}</p>
                      <p className="text-xs text-gray-400">{client.rut} &bull; {client.dias} dias de atraso</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">${client.deuda.toLocaleString('es-CL')}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoColor(client.estado)}`}>
                        {client.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generador de Script */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Generador de Script con IA</h2>
            </div>
            <div className="p-5">
              {selectedClient ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="font-semibold text-blue-800">{selectedClient.nombre}</p>
                    <p className="text-sm text-blue-600">Deuda: ${selectedClient.deuda.toLocaleString('es-CL')} &bull; {selectedClient.dias} dias</p>
                  </div>

                  <button
                    onClick={generateAIScript}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Generando script...' : 'Generar Script con IA'}
                  </button>

                  {script && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-2">SCRIPT GENERADO</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{script}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(script)}
                        className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Copiar script
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-4xl mb-3">👆</div>
                  <p className="text-gray-500 text-sm">Selecciona un cliente de la lista para generar un script de cobranza personalizado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
