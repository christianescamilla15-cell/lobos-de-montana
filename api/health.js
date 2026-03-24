// GET /api/health — Health check
export default function handler(req, res) {
  res.json({
    status: 'ok',
    name: 'Lobos de la Montana API',
    version: '1.0.0',
    endpoints: [
      'GET /api/products',
      'GET /api/products?category=footwear',
      'POST /api/orders',
      'POST /api/contact',
      'GET /api/health'
    ],
    timestamp: new Date().toISOString()
  });
}
