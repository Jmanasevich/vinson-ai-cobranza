import './globals.css'

export const metadata = {
  title: 'VINSON - Sistema de Cobranza con IA',
  description: 'Sistema de cobranza inteligente para Parque del Recuerdo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}
