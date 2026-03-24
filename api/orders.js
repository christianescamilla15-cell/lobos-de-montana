// POST /api/orders — Create an order
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

  const { items, customer } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!customer || !customer.name || !customer.email) {
    return res.status(400).json({ error: 'Customer name and email required' });
  }

  const orderId = `LM-${Date.now().toString(36).toUpperCase()}`;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  res.json({
    orderId,
    status: 'confirmed',
    items,
    customer,
    subtotal,
    shipping,
    total,
    freeShipping: shipping === 0,
    estimatedDelivery: '3-5 días hábiles',
    message: `Orden ${orderId} confirmada. Total: $${total.toLocaleString()} MXN`
  });
}
