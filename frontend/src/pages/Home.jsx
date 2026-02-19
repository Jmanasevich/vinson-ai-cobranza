import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://vinson-ai-cobranza-backend.vercel.app'

function Home() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      } else {
        setError(data.error || 'Credenciales invalidas')
      }
    } catch (err) {
      setError('Error de conexion con el servidor')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-600 text-white text-2xl font-black px-4 py-2 rounded-xl mb-3">
            VINSON
          </div>
          <h2 className="text-gray-700 text-lg font-medium">Sistema de Cobranza con IA</h2>
          <p className="text-gray-400 text-sm mt-1">Parque del Recuerdo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejecutivo@parque.cl"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contrasena"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-60"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 font-medium mb-1">Accesos de prueba:</p>
          <p className="text-xs text-blue-500">ejecutivo1@parque.cl / demo123</p>
          <p className="text-xs text-blue-500">ejecutivo2@parque.cl / demo123</p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Vinson AI Cobranza 2024 - Parque del Recuerdo
        </p>
      </div>
    </div>
  )
}

export default Home
