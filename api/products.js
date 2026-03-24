// GET /api/products — Returns all products
// GET /api/products?category=footwear — Filter by category
export default function handler(req, res) {
  const products = [
    { id: "botas-cana-media", name: "Botas de Caña Media", price: 1299, category: "footwear", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400", description: "Impermeables con suela Vibram y soporte de tobillo", sizes: ["25", "26", "27", "28", "29", "30"], stock: 15 },
    { id: "sudadera-impermeable", name: "Sudadera Impermeable", price: 899, category: "outerwear", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", description: "Forro micro-polar, capucha ajustable", sizes: ["S", "M", "L", "XL"], stock: 22 },
    { id: "bastones-senderismo", name: "Bastones de Senderismo", price: 649, category: "gear", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400", description: "Aluminio ultraligero, sistema quick-lock 65-135cm", sizes: ["Unica"], stock: 30 },
    { id: "mochila-hidratacion", name: "Mochila de Hidratación 15L", price: 1499, category: "bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", description: "Espalda ventilada, compartimento para vejiga de agua", sizes: ["Unica"], stock: 8 },
    { id: "gorra-uv", name: "Gorra Protección UV", price: 349, category: "accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400", description: "Protección UV 50+, secado rápido", sizes: ["Unica"], stock: 45 },
    { id: "pantalon-convertible", name: "Pantalón Convertible Trekking", price: 749, category: "outerwear", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", description: "Piernas desmontables, repelente al agua", sizes: ["S", "M", "L", "XL"], stock: 18 },
    { id: "guantes-termicos", name: "Guantes Térmicos Táctiles", price: 499, category: "accessories", image: "https://images.unsplash.com/photo-1545170131-92867a2a65b8?w=400", description: "Compatibles con pantallas táctiles, impermeables", sizes: ["S", "M", "L", "XL"], stock: 25 },
    { id: "cantimplora-termica", name: "Cantimplora Térmica 750ml", price: 399, category: "accessories", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", description: "Mantiene frío 24h, caliente 12h", sizes: ["Unica"], stock: 35 },
    { id: "gafas-deportivas", name: "Gafas Deportivas Polarizadas", price: 599, category: "accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400", description: "Polarizadas, UV400, marco TR90", sizes: ["Unica"], stock: 20 }
  ];

  const { category } = req.query;
  const filtered = category ? products.filter(p => p.category === category) : products;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ products: filtered, total: filtered.length });
}
