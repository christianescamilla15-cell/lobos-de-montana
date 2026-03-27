// GET /api/products — Returns all products
// GET /api/products?category=footwear — Filter by category
export default function handler(req, res) {
  const products = [
    { id: "botas-cana-media", name: "Botas de Cana Media", price: 1299, category: "footwear", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop", description: "Soporte y traccion para terrenos irregulares. Disenadas para caminatas de media y larga distancia.", sizes: ["25", "26", "27", "28", "29", "30"], stock: 15 },
    { id: "sudadera-impermeable", name: "Sudadera Impermeable", price: 899, category: "outerwear", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=400&fit=crop", description: "Proteccion contra lluvia y viento sin sacrificar transpirabilidad. Ideal para senderismo en cualquier clima.", sizes: ["S", "M", "L", "XL"], stock: 22 },
    { id: "bastones-senderismo", name: "Bastones de Senderismo", price: 649, category: "gear", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop", description: "Ultraligeros y ajustables. Reducen el impacto en rodillas y mejoran tu estabilidad en cualquier terreno.", sizes: ["Unica"], stock: 30 },
    { id: "mochila-hidratacion-15l", name: "Mochila de Hidratacion 15L", price: 1499, category: "bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop", description: "Espalda ventilada, compartimento para bolsa de agua, cinturon lumbar acolchado", sizes: ["Unica"], stock: 8 },
    { id: "gorra-proteccion-uv", name: "Gorra Proteccion UV", price: 349, category: "accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=400&fit=crop", description: "Proteccion UV 50+, secado rapido, visera curva con ajuste trasero", sizes: ["Unica"], stock: 45 },
    { id: "pantalon-convertible", name: "Pantalon Convertible Trekking", price: 749, category: "outerwear", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=400&fit=crop", description: "Piernas desmontables con zipper, tela ripstop repelente al agua", sizes: ["S", "M", "L", "XL"], stock: 18 },
    { id: "guantes-termicos", name: "Guantes Termicos Tactiles", price: 499, category: "accessories", image: "https://images.unsplash.com/photo-1545170232-8c0f5d4e0e0b?w=600&h=400&fit=crop", description: "Compatibles con pantallas tactiles, impermeables, forro polar interno", sizes: ["S", "M", "L", "XL"], stock: 25 },
    { id: "cantimplora-termica", name: "Cantimplora Termica 750ml", price: 399, category: "accessories", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=400&fit=crop", description: "Acero inoxidable doble pared, mantiene frio 24h o caliente 12h", sizes: ["Unica"], stock: 35 },
    { id: "gafas-deportivas", name: "Gafas Deportivas Polarizadas", price: 599, category: "accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop", description: "Lentes polarizados UV400, marco ultraligero, ideal para alta montana", sizes: ["Unica"], stock: 20 }
  ];

  const { category } = req.query;
  const filtered = category ? products.filter(p => p.category === category) : products;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ products: filtered, total: filtered.length });
}
