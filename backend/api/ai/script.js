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
  const client = CLIENTS.find(c => c.id === clientId);
  
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });

  const sensitiveContext = client.isSensitiveDate
    ? `ATENCIÓN: Hoy es aniversario del fallecimiento de ${client.deceasedName}. Tono de MÁXIMO RESPETO Y CONDOLENCIA. No presionar, sino acompañar y ofrecer solución como ayuda.`
    : '';

  const warning = WARNINGS[warningKey] || { label: 'Recordatorio' };
  const solution = SOLUTIONS.find(s => s.id === solutionKey) || { label: 'Regularización' };

  const prompt = `
Rol: Ejecutivo Senior de Parque del Recuerdo (cementerio premium).
${sensitiveContext}

Cliente: ${client.name}
Deuda: ${formatCurrencyCLP(client.debt)}
Días de mora: ${client.daysOverdue}
Producto: ${client.product}
Alerta crítica: "${warning.label}"
Solución propuesta: "${solution.label}"

Genera un guión CORTO y empático (máximo 8 líneas) para contacto telefónico que:
1. Saludo respetuoso considerando que es un servicio funerario
2. Menciona brevemente el riesgo "${warning.label}" sin alarmar
3. Ofrece la solución "${solution.label}" como forma de dar tranquilidad a la familia
4. Cierre invitando a conversación

Tono: Profesional, cálido, respetuoso. Sin tecnicismos.`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: 'Error: API key no configurada. Contacta al administrador.' });
  }

  const text = await geminiGenerate(prompt, apiKey);
  res.status(200).json({ text });
}
