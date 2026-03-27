// GET /api/products — Returns all products
// GET /api/products?category=footwear — Filter by category
export default function handler(req, res) {
  const products = [
    { id: "botas-cana-media", name: "Botas de Cana Media", price: 1299, category: "footwear", image: "./images/botas.jpg", description: "Soporte y traccion para terrenos irregulares. Disenadas para caminatas de media y larga distancia.", sizes: ["25", "26", "27", "28", "29", "30"], stock: 15 },
    { id: "sudadera-impermeable", name: "Sudadera Impermeable", price: 899, category: "outerwear", image: "./images/chaqueta.jpg", description: "Proteccion contra lluvia y viento sin sacrificar transpirabilidad. Ideal para senderismo en cualquier clima.", sizes: ["S", "M", "L", "XL"], stock: 22 },
    { id: "bastones-senderismo", name: "Bastones de Senderismo", price: 649, category: "gear", image: "./images/bastones.jpg", description: "Ultraligeros y ajustables. Reducen el impacto en rodillas y mejoran tu estabilidad en cualquier terreno.", sizes: ["Unica"], stock: 30 },
    { id: "mochila-hidratacion-15l", name: "Mochila de Hidratacion 15L", price: 1499, category: "bags", image: "./images/mochila.jpg", description: "Espalda ventilada, compartimento para bolsa de agua, cinturon lumbar acolchado", sizes: ["Unica"], stock: 8 },
    { id: "gorra-proteccion-uv", name: "Gorra Proteccion UV", price: 349, category: "accessories", image: "./images/gorra.jpg", description: "Proteccion UV 50+, secado rapido, visera curva con ajuste trasero", sizes: ["Unica"], stock: 45 },
    { id: "pantalon-convertible", name: "Pantalon Convertible Trekking", price: 749, category: "outerwear", image: "./images/pantalon.jpg", description: "Piernas desmontables con zipper, tela ripstop repelente al agua", sizes: ["S", "M", "L", "XL"], stock: 18 },
    { id: "guantes-termicos", name: "Guantes Termicos Tactiles", price: 499, category: "accessories", image: "./images/guantes.jpg", description: "Compatibles con pantallas tactiles, impermeables, forro polar interno", sizes: ["S", "M", "L", "XL"], stock: 25 },
    { id: "cantimplora-termica", name: "Cantimplora Termica 750ml", price: 399, category: "accessories", image: "./images/cantimplora.jpg", description: "Acero inoxidable doble pared, mantiene frio 24h o caliente 12h", sizes: ["Unica"], stock: 35 },
    { id: "gafas-deportivas", name: "Gafas Deportivas Polarizadas", price: 599, category: "accessories", image: "./images/lentes.jpg", description: "Lentes polarizados UV400, marco ultraligero, ideal para alta montana", sizes: ["Unica"], stock: 20 }
  ];

  const { category } = req.query;
  const filtered = category ? products.filter(p => p.category === category) : products;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ products: filtered, total: filtered.length });
}
