/* ==========================================================================
   Lobos de Montana — Bilingual Support (ES/EN)
   Stores language in localStorage, swaps text via data-i18n attributes.
   ========================================================================== */
(function () {
  'use strict';

  const STORAGE_KEY = 'lobos_lang';

  const translations = {
    // Navbar
    'nav.inicio': { es: 'Inicio', en: 'Home' },
    'nav.destacados': { es: 'Destacados', en: 'Featured' },
    'nav.catalogo': { es: 'Catalogo', en: 'Catalog' },
    'nav.nosotros': { es: 'Nosotros', en: 'About Us' },
    'nav.contacto': { es: 'Contacto', en: 'Contact' },

    // Hero
    'hero.title': { es: 'Lobos de Montana', en: 'Mountain Wolves' },
    'hero.text': { es: 'Conquista cada sendero — equipo que resiste como tu', en: 'Conquer every trail — gear that endures like you' },
    'hero.cta': { es: 'Explorar productos', en: 'Explore products' },

    // Featured section
    'featured.title': { es: 'Productos Destacados', en: 'Featured Products' },
    'featured.subtitle': { es: 'Lo esencial para tu proxima aventura', en: 'The essentials for your next adventure' },

    // Catalog section
    'catalog.title': { es: 'Catalogo', en: 'Catalog' },
    'catalog.subtitle': { es: 'Explora nuestro equipo para cada aventura', en: 'Explore our gear for every adventure' },

    // About section
    'about.title': { es: 'Sobre Nosotros', en: 'About Us' },
    'about.text1': {
      es: 'Somos <strong>Lobos de Montana</strong>, una tienda especializada en equipo de senderismo y montanismo. Nacimos de la pasion por explorar los senderos mas desafiantes y la necesidad de contar con equipo confiable que resista cada aventura.',
      en: 'We are <strong>Mountain Wolves</strong>, a store specializing in hiking and mountaineering gear. Born from the passion for exploring the most challenging trails and the need for reliable equipment that endures every adventure.'
    },
    'about.text2': {
      es: 'Nuestro compromiso es ofrecer productos de alta calidad, seleccionados por expertos en deportes de montana, para que cada paso que des sea seguro y comodo.',
      en: 'Our commitment is to offer high-quality products, selected by mountain sports experts, so every step you take is safe and comfortable.'
    },
    'about.stat.products': { es: 'Productos', en: 'Products' },
    'about.stat.clients': { es: 'Clientes', en: 'Clients' },
    'about.stat.states': { es: 'Estados', en: 'States' },

    // Contact section
    'contact.title': { es: 'Contactanos', en: 'Contact Us' },
    'contact.subtitle': { es: 'Tienes dudas? Escribenos y te ayudamos a elegir tu equipo ideal', en: 'Have questions? Write to us and we\'ll help you choose your ideal gear' },
    'contact.location': { es: 'Ubicacion', en: 'Location' },
    'contact.phone': { es: 'Telefono', en: 'Phone' },
    'contact.email': { es: 'Correo', en: 'Email' },
    'contact.hours': { es: 'Horario', en: 'Hours' },
    'contact.hours.value': { es: 'Lun - Sab: 9:00 - 20:00', en: 'Mon - Sat: 9:00 AM - 8:00 PM' },
    'contact.form.name': { es: 'Nombre completo *', en: 'Full name *' },
    'contact.form.name.placeholder': { es: 'Tu nombre', en: 'Your name' },
    'contact.form.email': { es: 'Correo electronico *', en: 'Email address *' },
    'contact.form.subject': { es: 'Asunto *', en: 'Subject *' },
    'contact.form.subject.placeholder': { es: 'En que podemos ayudarte?', en: 'How can we help you?' },
    'contact.form.message': { es: 'Mensaje *', en: 'Message *' },
    'contact.form.message.placeholder': { es: 'Escribe tu mensaje...', en: 'Write your message...' },
    'contact.form.submit': { es: 'Enviar mensaje', en: 'Send message' },

    // Cart
    'cart.title': { es: 'Mi Carrito', en: 'My Cart' },
    'cart.checkout': { es: 'Finalizar compra', en: 'Checkout' },
    'cart.empty': { es: 'Vaciar carrito', en: 'Empty cart' },

    // Buttons
    'btn.addcart': { es: 'Agregar al carrito', en: 'Add to cart' },
    'btn.buy': { es: 'Comprar', en: 'Buy' },
    'btn.add': { es: 'Agregar', en: 'Add' },

    // Footer
    'footer.desc': { es: 'Equipo de montana y senderismo para los mas aventureros. Calidad, resistencia y estilo en cada producto.', en: 'Mountain and hiking gear for the most adventurous. Quality, endurance and style in every product.' },
    'footer.nav': { es: 'Navegacion', en: 'Navigation' },
    'footer.follow': { es: 'Siguenos', en: 'Follow Us' },
    'footer.copy': { es: '\u00A9 2026 Lobos de Montana. Todos los derechos reservados.', en: '\u00A9 2026 Mountain Wolves. All rights reserved.' },
    'footer.featured': { es: 'Productos Destacados', en: 'Featured Products' },

    // Product names
    'product.botas': { es: 'Botas de Cana Media', en: 'Mid-Rise Hiking Boots' },
    'product.sudadera': { es: 'Sudadera Impermeable', en: 'Waterproof Hoodie' },
    'product.bastones': { es: 'Bastones de Senderismo', en: 'Hiking Poles' },
    'product.mochila': { es: 'Mochila de Hidratacion 15L', en: '15L Hydration Backpack' },
    'product.gorra': { es: 'Gorra Proteccion UV', en: 'UV Protection Cap' },
    'product.pantalon': { es: 'Pantalon Convertible Trekking', en: 'Convertible Trekking Pants' },
    'product.guantes': { es: 'Guantes Termicos Tactiles', en: 'Thermal Touch Gloves' },
    'product.cantimplora': { es: 'Cantimplora Termica 750ml', en: '750ml Thermal Bottle' },
    'product.gafas': { es: 'Gafas Deportivas Polarizadas', en: 'Polarized Sport Sunglasses' },

    // Product descriptions (featured)
    'desc.botas': { es: 'Soporte y traccion para terrenos irregulares. Disenadas para caminatas de media y larga distancia.', en: 'Support and traction for rugged terrain. Designed for medium and long-distance hikes.' },
    'desc.sudadera': { es: 'Proteccion contra lluvia y viento sin sacrificar transpirabilidad. Ideal para senderismo en cualquier clima.', en: 'Rain and wind protection without sacrificing breathability. Ideal for hiking in any weather.' },
    'desc.bastones': { es: 'Ultraligeros y ajustables. Reducen el impacto en rodillas y mejoran tu estabilidad en cualquier terreno.', en: 'Ultralight and adjustable. Reduce knee impact and improve stability on any terrain.' },

    // Badges
    'badge.nuevo': { es: 'Nuevo', en: 'New' },
    'badge.popular': { es: 'Popular', en: 'Popular' },
    'badge.esencial': { es: 'Esencial', en: 'Essential' },

    // Shipping banner
    'banner.shipping': { es: 'Envio gratis en compras mayores a $999', en: 'Free shipping on orders over $999' },

    // Countdown
    'countdown.label': { es: 'Oferta termina en', en: 'Offer ends in' },

    // Live visitors
    'visitors.label': { es: 'personas viendo ahora', en: 'people viewing now' },

    // Instagram
    'instagram.title': { es: 'Siguenos en Instagram', en: 'Follow us on Instagram' },

    // Size guide
    'sizeguide.title': { es: 'Guia de Tallas', en: 'Size Guide' },
    'sizeguide.footwear': { es: 'Calzado', en: 'Footwear' },
    'sizeguide.size': { es: 'Talla', en: 'Size' },
    'sizeguide.chest': { es: 'Pecho (cm)', en: 'Chest (cm)' },
    'sizeguide.waist': { es: 'Cintura (cm)', en: 'Waist (cm)' },
    'sizeguide.hip': { es: 'Cadera (cm)', en: 'Hip (cm)' },
    'sizeguide.link': { es: 'Guia de tallas', en: 'Size guide' },

    // Newsletter
    'newsletter.title': { es: 'Unete a la manada', en: 'Join the pack' },
    'newsletter.desc': { es: 'Recibe ofertas exclusivas', en: 'Get exclusive deals' },
    'newsletter.btn': { es: 'Suscribirme', en: 'Subscribe' },
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'es';
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function applyTranslations(lang) {
    // Text content via data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const t = translations[key];
      if (!t) return;
      if (t[lang] !== undefined) {
        if (t[lang].indexOf('<strong>') !== -1 || t[lang].indexOf('<i ') !== -1) {
          el.innerHTML = t[lang];
        } else {
          el.textContent = t[lang];
        }
      }
    });

    // Placeholders via data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      const t = translations[key];
      if (t && t[lang] !== undefined) {
        el.placeholder = t[lang];
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update toggle button text
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.textContent = lang === 'es' ? 'EN' : 'ES';
      toggle.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a Espanol');
    }

    // Notify chatbot about language change
    if (window.lobosSetChatbotLang) {
      window.lobosSetChatbotLang(lang);
    }
  }

  function createToggle() {
    const navbar = document.querySelector('#navbarInicio .navbar-nav');
    if (!navbar) return;

    const li = document.createElement('li');
    li.className = 'nav-item';

    const btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.className = 'nav-link btn btn-link';
    btn.style.cssText = 'font-weight:700;font-size:14px;letter-spacing:1px;padding:6px 12px;border:1px solid rgba(169,192,222,0.4);border-radius:6px;color:#A9C0DE;cursor:pointer;background:transparent;';
    const currentLang = getLang();
    btn.textContent = currentLang === 'es' ? 'EN' : 'ES';
    btn.setAttribute('aria-label', currentLang === 'es' ? 'Switch to English' : 'Cambiar a Espanol');

    btn.addEventListener('click', function () {
      const current = getLang();
      const next = current === 'es' ? 'en' : 'es';
      setLang(next);
      applyTranslations(next);
    });

    li.appendChild(btn);
    navbar.appendChild(li);
  }

  // Expose for external use
  window.lobosI18n = {
    getLang: getLang,
    setLang: setLang,
    applyTranslations: applyTranslations,
    translations: translations
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', function () {
    createToggle();
    const lang = getLang();
    applyTranslations(lang);
  });
})();
