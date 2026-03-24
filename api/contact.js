// POST /api/contact — Handle contact form
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const ticketId = `CT-${Date.now().toString(36).toUpperCase()}`;

  res.json({
    ticketId,
    status: 'received',
    message: `Gracias ${name}, hemos recibido tu mensaje. Te contactaremos pronto. Ref: ${ticketId}`
  });
}
