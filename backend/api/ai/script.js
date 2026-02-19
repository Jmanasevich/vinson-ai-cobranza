import { requireAuth } from '../../lib/auth.js';
import { CLIENTS, WARNINGS, SOLUTIONS } from '../../lib/data.js';
import { geminiGenerate, formatCurrencyCLP } from '../../lib/gemini.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { clientId, warningKey, solutionKey } = req.body || {};

  const client = CLIENTS.find(c => c.id === clientId || c.id === String(clientId));
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado', clientId, available: CLIENTS.map(c=>c.id) });

  const warning = WARNINGS[warningKey] || { label: 'Recordatorio de Pago' };
  const solution = SOLUTIONS.find(s => s.id === solutionKey) || { label: 'Renegociacion' };

  const sensitiveContext = client.isSensitiveDate
    ? `ATENCION: Hoy es aniversario del fallecimiento de ${client.deceasedName}. Tono de MAXIMO RESPETO Y CONDOLENCIA.`
    : '';

  const prompt = `Rol: Ejecutivo Senior de Parque del Recuerdo (cementerio premium).
${sensitiveContext}
Cliente: ${client.name}
Deuda: ${formatCurrencyCLP(client.debt)}
Dias de mora: ${client.daysOverdue}
Producto: ${client.product}
Alerta critica: "${warning.label || warningKey}"
Solucion propuesta: "${solution.label || solutionKey}"

Genera un guion CORTO y empatico (maximo 8 lineas) para contacto telefonico que:
1. Saludo respetuoso considerando que es un servicio funerario
2. Menciona brevemente el riesgo "${warning.label || warningKey}" sin alarmar
3. Ofrece la solucion "${solution.label || solutionKey}" como forma de dar tranquilidad a la familia
4. Cierre invitando a conversacion
Tono: Profesional, calido, respetuoso.`;

  const apiKey = process.env.GEMINI_API_KEY;

  let text = null;

  if (apiKey) {
    try {
      text = await geminiGenerate(prompt, apiKey);
      if (text && (text.includes('no disponible') || text.includes('Verifique'))) {
        text = null;
      }
    } catch (e) {
      console.error('Gemini error:', e.message);
    }
  }

  if (!text) {
    text = `Buenos dias, ${client.name}.

Le contactamos del equipo de Parque del Recuerdo. Nuestros registros indican una deuda de ${formatCurrencyCLP(client.debt)} con ${client.daysOverdue} dias de mora en su contrato de ${client.product}.

Sabemos que son momentos dificiles. Por eso queremos informarle que existe un riesgo de ${warning.label || warningKey}, y nos gustaria ofrecerle una solucion de ${solution.label || solutionKey} que se ajuste a sus posibilidades.

Podriamos coordinar una reunion o llamada para revisar las opciones disponibles? Estamos aqui para ayudarle a encontrar la mejor alternativa para su familia.`;
  }

  res.status(200).json({ text });
}
