import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://vinson-ai-cobranza-backend.vercel.app'

const WARNINGS = {
  seguro: 'Perdida de Seguro',
  uso: 'Perdida Derecho Uso',
  castigo: 'Paso a Castigo',
  dicom: 'Ingreso a DICOM',
  externa: 'Cobranza Externa',
  judicial: 'Aviso Judicial',
  resciliacion: 'Resciliacion',
  exhumacion: 'Riesgo Exhumacion'
}

const SOLUTIONS = [
  { id: 'renegociacion', label: 'Renegociacion' },
  { id: 'refinanciamiento', label: 'Refinanciamiento' },
  { id: 'menor_valor', label: 'Cambio Menor Valor' },
  { id: 'cambio_titular', label: 'Cambio de Titular' },
  { id: 'descuento', label: 'Descuento Intereses' },
  { id: 'fecha_corta', label: 'Fecha Corta' }
]

function Dashboard() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingClients, setLoadingClients] = useState(true)
  const [warningKey, setWarningKey] = useState('')
  const [solutionKey, setSolutionKey] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) {
      navigate('/')
      return
    }
    if (userData) setUser(JSON.parse(userData))
    fetchClients(token)
  }, [])

  const fetchClients = async (token) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/clients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.status === 401) {
        localStorage.clear()
        navigate('/')
        return
      }
      const data = await res.json()
      setClients(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Error al cargar clientes')
    }
    setLoadingClients(false)
  }

  const generateScript = async () => {
    if (!selectedClient) return
    const token = localStorage.getItem('token')
    setLoading(true)
    setScript('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clientId: selectedClient.id,
          warningKey: warningKey || selectedClient.warning || 'judicial',
          solutionKey: solutionKey || 'renegociacion'
        })
      })
      const data = await res.json()
      setScript(data.text || data.script || 'Script generado.')
    } catch (e) {
      setScript(`Buenos dias ${selectedClient.name}, le contactamos de Parque del Recuerdo respecto a una deuda de $${selectedClient.debt?.toLocaleString('es-CL')} con ${selectedClient.daysOverdue} dias de mora. Podemos ayudarle a regularizar su situacion.`)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const statusColor = (status) => {
    if (status === 'mora_critica') return 'bg-red-100 text-red-700'
    if (status === 'mora_severa') return 'bg-orange-100 text-orange-700'
    if (status === 'mora_media') return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const statusLabel = (status) => {
    if (status === 'mora_critica') return 'Critica'
    if (status === 'mora_severa') return 'Severa'
    if (status === 'mora_media') return 'Media'
    return 'Normal'
  }

  const totalDeuda = clients.reduce((s, c) => s + (c.debt || 0), 0)
  const urgentes = clients.filter(c => c.status === 'mora_critica' || c.status === 'mora_severa').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="bg-white text-blue-900 font-black px-3 py-1 rounded-lg text-sm">VINSON</span>
          <span className="text-sm font-medium opacity-80">Sistema de Cobranza con IA</span>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm opacity-70">{user.name}</span>}
          <button onClick={handleLogout} className="text-sm bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors">
            Cerrar sesion
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="px-6 py-4 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500 font-medium">Total Cartera</p>
          <p className="text-xl font-bold text-gray-800">${totalDeuda.toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500 font-medium">Clientes Activos</p>
          <p className="text-xl font-bold text-gray-800">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500 font-medium">Casos Urgentes</p>
          <p className="text-xl font-bold text-red-600">{urgentes}</p>
        </div>
      </div>

      <div className="px-6 pb-6 grid grid-cols-2 gap-4">
        {/* Lista de clientes */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">Cartera de Clientes</h2>
          </div>
          {loadingClients ? (
            <div className="p-8 text-center text-gray-400 text-sm">Cargando clientes...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 text-sm">{error}</div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No hay clientes disponibles</div>
          ) : (
            clients.map(client => (
              <div
                key={client.id}
                onClick={() => { setSelectedClient(client); setScript(''); setWarningKey(client.warning || ''); setSolutionKey('') }}
                className={`px-5 py-4 cursor-pointer hover:bg-blue-50 border-b transition-colors ${
                  selectedClient?.id === client.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{client.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{client.rut} &bull; {client.daysOverdue} dias de mora</p>
                    <p className="text-xs text-gray-400 mt-0.5">{client.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${(client.debt || 0).toLocaleString('es-CL')}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${statusColor(client.status)}`}>
                      {statusLabel(client.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Generador de Script */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">Generador de Script con IA</h2>
          </div>
          {selectedClient ? (
            <div className="p-5">
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-800">{selectedClient.name}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Deuda: ${(selectedClient.debt || 0).toLocaleString('es-CL')} &bull; {selectedClient.daysOverdue} dias &bull; Vinson Score: {selectedClient.vinsonScore}
                </p>
                <p className="text-xs text-blue-500 mt-0.5">{selectedClient.product} &bull; Sector {selectedClient.sector}</p>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Alerta critica</label>
                <select
                  value={warningKey}
                  onChange={e => setWarningKey(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(WARNINGS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Solucion propuesta</label>
                <select
                  value={solutionKey}
                  onChange={e => setSolutionKey(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SOLUTIONS.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={generateScript}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
              >
                {loading ? 'Generando script...' : 'Generar Script con IA'}
              </button>

              {script && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Script generado</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(script)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Copiar
                    </button>
                  </div>
                  <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {script}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-4xl mb-3">&#128077;</p>
              <p className="text-gray-500 text-sm">Selecciona un cliente de la lista para generar un script de cobranza personalizado con IA</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
