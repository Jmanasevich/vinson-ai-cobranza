# Sistema VINSON - Cobranza con IA

## Guía de Instalación y Despliegue

### Requisitos Previos

- Node.js 18 o superior
- Cuenta en Vercel (para despliegue)
- API Key de Google Gemini

### Instalación Local

#### 1. Backend

```bash
cd backend
npm install

# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar .env y agregar:
# - JWT_SECRET (genera uno aleatorio)
# - GEMINI_API_KEY (obtén tu API key en Google AI Studio)

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:3001`

#### 2. Frontend

```bash
cd frontend
npm install

# Crear archivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

### Despliegue en Vercel

#### Backend

1. Sube el proyecto a GitHub
2. Conecta tu repositorio en Vercel
3. Configura el directorio raíz como `backend`
4. Agrega las variables de entorno:
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `FRONTEND_URL` (URL de tu frontend desplegado)
5. Despliega

#### Frontend

1. Crea un nuevo proyecto en Vercel
2. Configura el directorio raíz como `frontend`
3. Agrega la variable de entorno:
   - `NEXT_PUBLIC_API_URL` (URL de tu backend desplegado)
4. Despliega

### Usuario por Defecto

El sistema creará automáticamente usuarios de prueba al iniciar:

- **Usuario**: admin
- **Contraseña**: admin123

**IMPORTANTE**: Cambia la contraseña en producción.

### Características

- ✅ Autenticación simple por password
- ✅ Generación de scripts de cobranza con IA (Gemini)
- ✅ Catálogo de clientes
- ✅ Historial de conversaciones
- ✅ Base de datos SQLite
- ✅ Interfaz moderna con Next.js y Tailwind CSS

### Estructura del Proyecto

```
vinson-ai-cobranza/
├── backend/
│   ├── api/          # Endpoints de la API
│   ├── lib/          # Utilidades (DB, Auth, Gemini)
│   ├── index.js      # Servidor principal
│   └── package.json
├── frontend/
│   ├── app/          # Páginas Next.js
│   ├── components/   # Componentes React
│   └── package.json
└── README.md
```

### Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.
