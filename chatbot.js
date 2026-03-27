/* ==========================================================================
   Lobos de Montaña — Chatbot Interactivo (Self-Contained)
   Autor: Chris | Branch: Indez-Destacados-Chris
   Descripción: Chatbot flotante de atención al cliente. Se inyecta solo
   en el DOM (HTML + CSS) al cargar la página. Vanilla JS, sin dependencias.
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     CONSTANTES Y DATOS DEL NEGOCIO
  ------------------------------------------------------------------------ */
  const STORAGE_KEY = 'lobos_chatbot_history';

  const PRODUCTS = [
    { nombre: 'Botas de Senderismo', precio: 1299 },
    { nombre: 'Sudadera Térmica', precio: 899 },
    { nombre: 'Bastones de Trekking', precio: 649 },
    { nombre: 'Mochila de Montaña', precio: 1499 },
    { nombre: 'Gorra Trail', precio: 349 },
    { nombre: 'Pantalón Outdoor', precio: 749 },
    { nombre: 'Guantes Técnicos', precio: 499 },
    { nombre: 'Cantimplora Térmica', precio: 399 },
    { nombre: 'Gafas de Sol Deportivas', precio: 599 },
  ];

  const SIZING = {
    botas: 'Nuestras botas van de la talla 25 a la 30 (MX). Te recomendamos media talla más si usarás calcetines gruesos.',
    sudadera: 'Las sudaderas están disponibles en tallas S, M, L y XL. Tienen corte regular; si prefieres holgado, sube una talla.',
    pantalon: 'Los pantalones van de la talla 28 a la 36. Consulta nuestra guía de medidas en la sección de cada producto.',
    guantes: 'Los guantes están en tallas S, M, L y XL. Mide el contorno de tu mano (sin pulgar) para elegir la correcta.',
    gorra: 'Las gorras son talla unitalla con ajuste trasero.',
    general: 'Tenemos tallas de la S a la XL en ropa, y 25-30 en calzado. ¿Sobre qué producto necesitas ayuda con la talla?',
  };

  const QUICK_REPLIES_MAIN = [
    { label: '🛍️ Ver productos', value: 'productos' },
    { label: '📏 Ayuda con tallas', value: 'tallas' },
    { label: '🚚 Envíos', value: 'envios' },
    { label: '↩️ Devoluciones', value: 'devoluciones' },
    { label: '🕐 Horarios', value: 'horarios' },
    { label: '📞 Contacto', value: 'contacto' },
  ];

  /* -----------------------------------------------------------------------
     INYECCIÓN DE ESTILOS
  ------------------------------------------------------------------------ */
  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'lobos-chatbot-styles';
    style.textContent = `
      /* === Variables del chatbot === */
      :root {
        --cb-fondo: #161F28;
        --cb-card: #1E3765;
        --cb-acento: #A9C0DE;
        --cb-acento-hover: #D3DFE8;
        --cb-texto: #D3DFE8;
        --cb-texto-sec: #A9C0DE;
        --cb-user-bg: #2B5EA7;
        --cb-bot-bg: #1E3765;
        --cb-radius: 16px;
        --cb-shadow: 0 8px 32px rgba(0,0,0,.45);
      }

      /* === Botón flotante === */
      #lobos-chat-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--cb-card);
        border: 2px solid var(--cb-acento);
        color: var(--cb-acento);
        font-size: 28px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--cb-shadow);
        transition: transform .25s ease, background .25s ease, color .25s ease;
        line-height: 1;
        padding: 0;
      }
      #lobos-chat-btn:hover {
        transform: scale(1.1);
        background: var(--cb-acento);
        color: var(--cb-fondo);
        border-color: var(--cb-acento-hover);
      }
      #lobos-chat-btn .cb-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        background: #e74c3c;
        border-radius: 50%;
        font-size: 11px;
        font-weight: 700;
        color: #fff;
        display: none;
        align-items: center;
        justify-content: center;
        line-height: 1;
        pointer-events: none;
      }
      #lobos-chat-btn .cb-badge.show {
        display: flex;
      }

      /* === Ventana de chat === */
      #lobos-chat-window {
        position: fixed;
        bottom: 96px;
        right: 24px;
        z-index: 99998;
        width: 380px;
        max-width: calc(100vw - 32px);
        height: 540px;
        max-height: calc(100vh - 120px);
        background: var(--cb-fondo);
        border: 1px solid var(--cb-card);
        border-radius: var(--cb-radius);
        box-shadow: var(--cb-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
        opacity: 0;
        transform: translateY(20px) scale(.95);
        pointer-events: none;
        transition: opacity .3s ease, transform .3s ease;
      }
      #lobos-chat-window.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      /* Header */
      .cb-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px;
        background: var(--cb-card);
        color: var(--cb-texto);
        flex-shrink: 0;
      }
      .cb-header-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--cb-acento);
        color: var(--cb-fondo);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
      }
      .cb-header-info {
        flex: 1;
        min-width: 0;
      }
      .cb-header-title {
        font-size: 15px;
        font-weight: 700;
        margin: 0;
        line-height: 1.2;
      }
      .cb-header-sub {
        font-size: 11px;
        color: var(--cb-texto-sec);
        margin: 0;
      }
      .cb-header-close {
        background: none;
        border: none;
        color: var(--cb-texto-sec);
        font-size: 22px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
        transition: color .2s;
      }
      .cb-header-close:hover { color: var(--cb-acento-hover); }

      /* Mensajes */
      .cb-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scrollbar-width: thin;
        scrollbar-color: var(--cb-card) transparent;
      }
      .cb-messages::-webkit-scrollbar { width: 6px; }
      .cb-messages::-webkit-scrollbar-track { background: transparent; }
      .cb-messages::-webkit-scrollbar-thumb { background: var(--cb-card); border-radius: 3px; }

      .cb-msg {
        max-width: 82%;
        padding: 10px 14px;
        border-radius: 14px;
        font-size: 13.5px;
        line-height: 1.45;
        color: var(--cb-texto);
        word-break: break-word;
        animation: cbFadeIn .3s ease;
      }
      @keyframes cbFadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .cb-msg.bot {
        align-self: flex-start;
        background: var(--cb-bot-bg);
        border-bottom-left-radius: 4px;
      }
      .cb-msg.user {
        align-self: flex-end;
        background: var(--cb-user-bg);
        border-bottom-right-radius: 4px;
      }

      /* Indicador de escritura */
      .cb-typing {
        align-self: flex-start;
        display: none;
        gap: 5px;
        padding: 12px 18px;
        background: var(--cb-bot-bg);
        border-radius: 14px;
        border-bottom-left-radius: 4px;
      }
      .cb-typing.show { display: flex; }
      .cb-typing span {
        width: 7px;
        height: 7px;
        background: var(--cb-acento);
        border-radius: 50%;
        animation: cbBounce 1.4s infinite ease-in-out both;
      }
      .cb-typing span:nth-child(1) { animation-delay: 0s; }
      .cb-typing span:nth-child(2) { animation-delay: .2s; }
      .cb-typing span:nth-child(3) { animation-delay: .4s; }
      @keyframes cbBounce {
        0%, 80%, 100% { transform: scale(0); opacity: .4; }
        40% { transform: scale(1); opacity: 1; }
      }

      /* Quick replies */
      .cb-quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 4px 0 2px;
        animation: cbFadeIn .35s ease;
      }
      .cb-quick-btn {
        background: transparent;
        border: 1px solid var(--cb-acento);
        color: var(--cb-acento);
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 12.5px;
        font-family: inherit;
        cursor: pointer;
        transition: background .2s, color .2s;
        white-space: nowrap;
      }
      .cb-quick-btn:hover {
        background: var(--cb-acento);
        color: var(--cb-fondo);
      }

      /* Input area */
      .cb-input-area {
        display: flex;
        gap: 8px;
        padding: 12px 14px;
        border-top: 1px solid var(--cb-card);
        background: var(--cb-fondo);
        flex-shrink: 0;
      }
      .cb-input {
        flex: 1;
        background: var(--cb-card);
        border: 1px solid transparent;
        border-radius: 22px;
        padding: 10px 16px;
        font-size: 13.5px;
        color: var(--cb-texto);
        font-family: inherit;
        outline: none;
        transition: border-color .2s;
      }
      .cb-input::placeholder { color: var(--cb-texto-sec); opacity: .6; }
      .cb-input:focus { border-color: var(--cb-acento); }
      .cb-send-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: var(--cb-acento);
        color: var(--cb-fondo);
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background .2s;
        flex-shrink: 0;
      }
      .cb-send-btn:hover { background: var(--cb-acento-hover); }

      /* Responsive */
      @media (max-width: 440px) {
        #lobos-chat-window {
          right: 8px;
          bottom: 80px;
          width: calc(100vw - 16px);
          height: calc(100vh - 100px);
          border-radius: 12px;
        }
        #lobos-chat-btn { bottom: 14px; right: 14px; width: 54px; height: 54px; font-size: 24px; }
      }
    `;
    document.head.appendChild(style);
  }

  /* -----------------------------------------------------------------------
     INYECCIÓN DE HTML
  ------------------------------------------------------------------------ */
  function injectHTML() {
    /* Botón flotante — usa una huella de lobo SVG */
    var btn = document.createElement('button');
    btn.id = 'lobos-chat-btn';
    btn.setAttribute('aria-label', 'Abrir chat de ayuda');
    btn.innerHTML = `
      <svg viewBox="0 0 64 64" width="30" height="30" fill="currentColor" aria-hidden="true">
        <ellipse cx="20" cy="10" rx="6" ry="8"/>
        <ellipse cx="44" cy="10" rx="6" ry="8"/>
        <ellipse cx="10" cy="24" rx="5" ry="7"/>
        <ellipse cx="54" cy="24" rx="5" ry="7"/>
        <ellipse cx="32" cy="36" rx="16" ry="18"/>
      </svg>
      <span class="cb-badge" id="cb-badge">1</span>`;
    document.body.appendChild(btn);

    /* Ventana de chat */
    var win = document.createElement('div');
    win.id = 'lobos-chat-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat de atención al cliente');
    win.innerHTML = `
      <div class="cb-header">
        <div class="cb-header-avatar">
          <svg viewBox="0 0 64 64" width="22" height="22" fill="currentColor" aria-hidden="true">
            <ellipse cx="20" cy="10" rx="6" ry="8"/>
            <ellipse cx="44" cy="10" rx="6" ry="8"/>
            <ellipse cx="10" cy="24" rx="5" ry="7"/>
            <ellipse cx="54" cy="24" rx="5" ry="7"/>
            <ellipse cx="32" cy="36" rx="16" ry="18"/>
          </svg>
        </div>
        <div class="cb-header-info">
          <p class="cb-header-title">Lobos de Montaña</p>
          <p class="cb-header-sub">Asistente virtual • En línea</p>
        </div>
        <button class="cb-header-close" id="cb-close" aria-label="Cerrar chat">&times;</button>
      </div>
      <div class="cb-messages" id="cb-messages">
        <div class="cb-typing" id="cb-typing"><span></span><span></span><span></span></div>
      </div>
      <div class="cb-input-area">
        <input class="cb-input" id="cb-input" type="text" placeholder="Escribe tu mensaje…" autocomplete="off" />
        <button class="cb-send-btn" id="cb-send" aria-label="Enviar mensaje">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>`;
    document.body.appendChild(win);
  }

  /* -----------------------------------------------------------------------
     LÓGICA DEL CHATBOT
  ------------------------------------------------------------------------ */
  var isOpen = false;
  var hasUnread = false;

  function $(id) { return document.getElementById(id); }

  /* --- Persistencia --- */
  function saveHistory(messages) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch (_) { /* quota */ }
  }
  function loadHistory() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }

  /* --- Scroll automático --- */
  function scrollToBottom() {
    var el = $('cb-messages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  /* --- Añadir mensaje al DOM --- */
  function appendMessage(role, text, skipSave) {
    var container = $('cb-messages');
    var typing = $('cb-typing');
    var div = document.createElement('div');
    div.className = 'cb-msg ' + role;
    div.textContent = text;
    container.insertBefore(div, typing);
    scrollToBottom();

    if (!skipSave) {
      var history = loadHistory();
      history.push({ role: role, text: text });
      saveHistory(history);
    }
  }

  /* --- Quick replies --- */
  function showQuickReplies(replies) {
    var container = $('cb-messages');
    var typing = $('cb-typing');
    // Remove previous quick replies
    var old = container.querySelectorAll('.cb-quick-replies');
    old.forEach(function (el) { el.remove(); });

    var wrap = document.createElement('div');
    wrap.className = 'cb-quick-replies';
    replies.forEach(function (r) {
      var b = document.createElement('button');
      b.className = 'cb-quick-btn';
      b.textContent = r.label;
      b.addEventListener('click', function () {
        wrap.remove();
        handleUserInput(r.value);
      });
      wrap.appendChild(b);
    });
    container.insertBefore(wrap, typing);
    scrollToBottom();
  }

  /* --- Indicador de escritura --- */
  function showTyping() { var t = $('cb-typing'); if (t) { t.classList.add('show'); scrollToBottom(); } }
  function hideTyping() { var t = $('cb-typing'); if (t) t.classList.remove('show'); }

  /* --- Bot responde con delay (simula escritura) --- */
  function botReply(text, quickReplies, delay) {
    delay = delay || 800 + Math.min(text.length * 8, 1200);
    showTyping();
    setTimeout(function () {
      hideTyping();
      appendMessage('bot', text);
      if (quickReplies) showQuickReplies(quickReplies);
      if (!isOpen) setUnread(true);
    }, delay);
  }

  /* --- Badge de no leído --- */
  function setUnread(val) {
    hasUnread = val;
    var badge = $('cb-badge');
    if (badge) badge.classList.toggle('show', val);
  }

  /* --- Abrir / cerrar --- */
  function openChat() {
    var win = $('lobos-chat-window');
    if (!win) return;
    win.classList.add('open');
    isOpen = true;
    setUnread(false);
    var inp = $('cb-input');
    if (inp) inp.focus();
  }
  function closeChat() {
    var win = $('lobos-chat-window');
    if (!win) return;
    win.classList.remove('open');
    isOpen = false;
  }
  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  /* --- Navegación a secciones --- */
  function scrollToSection(selector) {
    try {
      var el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }
    } catch (_) { /* invalid selector */ }
    return false;
  }

  /* -----------------------------------------------------------------------
     MOTOR DE RESPUESTAS (NLP básico por palabras clave)
  ------------------------------------------------------------------------ */
  function normalizeInput(text) {
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function matchAny(normalized, keywords) {
    return keywords.some(function (k) { return normalized.indexOf(k) !== -1; });
  }

  function generateResponse(input) {
    var n = normalizeInput(input);

    /* Saludos */
    if (matchAny(n, ['hola', 'buenas', 'hey', 'hi', 'hello', 'que tal', 'buen dia', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos'])) {
      return {
        text: '¡Hola! 🐺 Bienvenido a Lobos de Montaña. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
        quick: QUICK_REPLIES_MAIN,
      };
    }

    /* Productos / catálogo */
    if (matchAny(n, ['producto', 'catalogo', 'que venden', 'que tienen', 'que ofrecen', 'articulo', 'inventario', 'ver productos'])) {
      var list = PRODUCTS.map(function (p) { return '• ' + p.nombre + ' — $' + p.precio.toLocaleString('es-MX'); }).join('\n');
      return {
        text: '¡Estos son nuestros productos destacados!\n\n' + list + '\n\nEnvío GRATIS en compras mayores a $999. ¿Te interesa alguno en especial?',
        quick: [
          { label: '📏 Ayuda con tallas', value: 'tallas' },
          { label: '🚚 Info de envíos', value: 'envios' },
          { label: '🔙 Menú principal', value: 'menu' },
        ],
      };
    }

    /* Producto específico - precios */
    if (matchAny(n, ['precio', 'cuanto cuesta', 'cuanto vale', 'costo'])) {
      var found = PRODUCTS.filter(function (p) {
        return normalizeInput(p.nombre).split(' ').some(function (w) { return n.indexOf(w) !== -1 && w.length > 3; });
      });
      if (found.length > 0) {
        var lines = found.map(function (p) { return p.nombre + ': $' + p.precio.toLocaleString('es-MX'); }).join('\n');
        return { text: lines + '\n\n¿Te gustaría saber algo más?' };
      }
      return { text: '¿De qué producto quieres saber el precio? Puedo darte información de cualquiera de nuestros artículos.', quick: [{ label: '🛍️ Ver todos', value: 'productos' }] };
    }

    /* Botas */
    if (matchAny(n, ['bota', 'botas', 'calzado', 'zapato'])) {
      return { text: 'Nuestras Botas de Senderismo ($1,299) son impermeables, con suela Vibram y soporte de tobillo reforzado. Ideales para terrenos rocosos. ' + SIZING.botas };
    }
    /* Sudadera */
    if (matchAny(n, ['sudadera', 'hoodie', 'sueter'])) {
      return { text: 'La Sudadera Térmica ($899) tiene forro de micro-polar, capucha ajustable y bolsillo canguro. Perfecta para climas fríos. ' + SIZING.sudadera };
    }
    /* Bastones */
    if (matchAny(n, ['baston', 'bastones', 'trekking poles'])) {
      return { text: 'Los Bastones de Trekking ($649) son de aluminio ultraligero, con sistema de bloqueo rápido y empuñadura de corcho. Se ajustan de 65 a 135 cm.' };
    }
    /* Mochila */
    if (matchAny(n, ['mochila', 'backpack', 'bolsa'])) {
      return { text: 'La Mochila de Montaña ($1,499) tiene 45L de capacidad, espalda ventilada, funda impermeable incluida y múltiples compartimentos. ¡Es nuestra más vendida!' };
    }
    /* Gorra */
    if (matchAny(n, ['gorra', 'sombrero', 'cachucha'])) {
      return { text: 'La Gorra Trail ($349) tiene protección UV 50+, secado rápido y ajuste trasero. ' + SIZING.gorra };
    }
    /* Pantalón */
    if (matchAny(n, ['pantalon', 'pants', 'jeans'])) {
      return { text: 'El Pantalón Outdoor ($749) es desmontable (se convierte en bermuda), repelente al agua y con bolsillos con cierre. ' + SIZING.pantalon };
    }
    /* Guantes */
    if (matchAny(n, ['guante', 'guantes'])) {
      return { text: 'Los Guantes Técnicos ($499) son táctiles, impermeables y con palma antideslizante. Perfectos para escalada y senderismo. ' + SIZING.guantes };
    }
    /* Cantimplora */
    if (matchAny(n, ['cantimplora', 'botella', 'agua', 'termo'])) {
      return { text: 'La Cantimplora Térmica ($399) mantiene tu bebida fría 24h o caliente 12h. Capacidad de 750ml, acero inoxidable y libre de BPA.' };
    }
    /* Gafas */
    if (matchAny(n, ['gafa', 'gafas', 'lentes', 'sol'])) {
      return { text: 'Las Gafas de Sol Deportivas ($599) tienen lentes polarizados, protección UV400, marco ligero de TR90 y patillas de goma antideslizantes.' };
    }

    /* Tallas */
    if (matchAny(n, ['talla', 'tallas', 'medida', 'size', 'sizing', 'mido', 'numero'])) {
      return {
        text: SIZING.general,
        quick: [
          { label: '👟 Botas', value: 'botas' },
          { label: '🧥 Sudadera', value: 'sudadera' },
          { label: '👖 Pantalón', value: 'pantalon' },
          { label: '🧤 Guantes', value: 'guantes' },
          { label: '🔙 Menú principal', value: 'menu' },
        ],
      };
    }

    /* Envíos */
    if (matchAny(n, ['envio', 'envios', 'entrega', 'shipping', 'mandar', 'paqueteria', 'llega', 'llegar', 'delivery'])) {
      return {
        text: '🚚 ¡Envío GRATIS en compras mayores a $999!\n\nTiempo de entrega: 3 a 5 días hábiles a toda la República Mexicana. Recibirás un número de rastreo por correo al momento del envío.',
        quick: [{ label: '↩️ Devoluciones', value: 'devoluciones' }, { label: '🔙 Menú principal', value: 'menu' }],
      };
    }

    /* Devoluciones */
    if (matchAny(n, ['devolucion', 'devoluciones', 'devolver', 'regreso', 'reembolso', 'cambio', 'garantia', 'return'])) {
      return {
        text: '↩️ Tienes 30 días a partir de la entrega para realizar devoluciones o cambios. El producto debe estar en su empaque original y sin uso. Los reembolsos se procesan en 5-7 días hábiles.',
        quick: [{ label: '📞 Contacto', value: 'contacto' }, { label: '🔙 Menú principal', value: 'menu' }],
      };
    }

    /* Horarios */
    if (matchAny(n, ['horario', 'horarios', 'hora', 'abierto', 'abren', 'cierran', 'cuando', 'atienden', 'disponible'])) {
      return {
        text: '🕐 Nuestro horario de atención:\n\n📅 Lunes a Sábado: 9:00 AM – 8:00 PM\n📅 Domingos: Cerrado\n\nEn línea puedes comprar las 24 horas.',
        quick: [{ label: '📞 Contacto', value: 'contacto' }, { label: '🔙 Menú principal', value: 'menu' }],
      };
    }

    /* Contacto */
    if (matchAny(n, ['contacto', 'contactar', 'telefono', 'correo', 'email', 'mail', 'llamar', 'whatsapp', 'numero'])) {
      return {
        text: '📞 ¡Con gusto te atendemos!\n\n📧 Email: contacto@lobosdemontana.mx\n📱 Teléfono: +52 55 1234 5678\n\nTambién puedes dejarnos un mensaje en nuestra sección de contacto.',
        quick: [
          { label: '📋 Ir a Contacto', value: 'ir contacto' },
          { label: '🔙 Menú principal', value: 'menu' },
        ],
      };
    }

    /* Navegación a secciones */
    if (matchAny(n, ['ir a destacado', 'ver destacado', 'ir destacado', 'ir a producto', 'seccion producto', 'ir producto'])) {
      scrollToSection('#productos-destacados');
      return { text: '¡Te llevo a la sección de Productos Destacados! 👆' };
    }
    if (matchAny(n, ['ir a catalogo', 'ver catalogo', 'ir catalogo', 'seccion catalogo'])) {
      scrollToSection('#catalogo');
      return { text: '¡Te llevo al Catálogo! 👆' };
    }
    if (matchAny(n, ['ir a nosotros', 'ver nosotros', 'ir nosotros', 'quienes son', 'acerca de'])) {
      scrollToSection('#nosotros');
      return { text: '¡Te llevo a la sección Nosotros! 👆' };
    }
    if (matchAny(n, ['ir a contacto', 'ir contacto', 'seccion contacto'])) {
      scrollToSection('#contacto');
      return { text: '¡Te llevo a la sección de Contacto! 👆' };
    }
    if (matchAny(n, ['ir a inicio', 'ir inicio', 'inicio', 'subir', 'arriba'])) {
      scrollToSection('#slogan');
      return { text: '¡Te llevo al inicio! 👆' };
    }

    /* Menú principal */
    if (matchAny(n, ['menu', 'opciones', 'ayuda', 'help', 'que puedes hacer'])) {
      return {
        text: '¿En qué puedo ayudarte? Elige una opción o escríbeme lo que necesites:',
        quick: QUICK_REPLIES_MAIN,
      };
    }

    /* Recomendación */
    if (matchAny(n, ['recomienda', 'recomendacion', 'sugieres', 'sugerencia', 'que me recomiendas', 'popular', 'mejor'])) {
      return {
        text: '¡Te recomiendo nuestros más vendidos!\n\n🥇 Mochila de Montaña ($1,499) — la favorita de los aventureros.\n🥈 Botas de Senderismo ($1,299) — comodidad y resistencia.\n🥉 Sudadera Térmica ($899) — perfecta para el frío.\n\nAdemás, con estos 3 productos tu envío es totalmente GRATIS. 🚚',
        quick: [{ label: '🛍️ Ver todos', value: 'productos' }, { label: '🔙 Menú', value: 'menu' }],
      };
    }

    /* Agradecimiento */
    if (matchAny(n, ['gracias', 'thank', 'genial', 'perfecto', 'excelente', 'buenisimo'])) {
      return {
        text: '¡Con mucho gusto! 🐺 Si necesitas algo más, aquí estaré. ¡Felices senderos!',
        quick: QUICK_REPLIES_MAIN,
      };
    }

    /* Despedida */
    if (matchAny(n, ['adios', 'bye', 'hasta luego', 'nos vemos', 'chao'])) {
      return { text: '¡Hasta pronto! 🐺🏔️ Que disfrutes la montaña. Recuerda que estamos aquí para lo que necesites.' };
    }

    /* Pago */
    if (matchAny(n, ['pago', 'pagar', 'tarjeta', 'efectivo', 'transferencia', 'forma de pago', 'metodo de pago', 'paypal', 'oxxo'])) {
      return {
        text: '💳 Aceptamos los siguientes métodos de pago:\n\n• Tarjeta de crédito/débito (Visa, Mastercard, AMEX)\n• PayPal\n• Transferencia bancaria\n• Depósito en OXXO\n\nTodas las transacciones son 100% seguras.',
        quick: [{ label: '🚚 Envíos', value: 'envios' }, { label: '🔙 Menú', value: 'menu' }],
      };
    }

    /* Oferta / descuento */
    if (matchAny(n, ['descuento', 'oferta', 'promocion', 'cupon', 'codigo', 'rebaja'])) {
      return {
        text: '🎉 ¡Actualmente tenemos envío GRATIS en compras mayores a $999! Mantente al pendiente de nuestras redes sociales para promociones exclusivas.',
        quick: [{ label: '🛍️ Ver productos', value: 'productos' }, { label: '🔙 Menú', value: 'menu' }],
      };
    }

    /* Fallback */
    return {
      text: 'Disculpa, no estoy seguro de haber entendido. 🤔 ¿Podrías reformular tu pregunta? También puedes elegir una de estas opciones:',
      quick: QUICK_REPLIES_MAIN,
    };
  }

  /* -----------------------------------------------------------------------
     PROCESAMIENTO DE ENTRADA DEL USUARIO
  ------------------------------------------------------------------------ */
  function handleUserInput(text) {
    if (!text || !text.trim()) return;
    text = text.trim();
    appendMessage('user', text);

    var res = generateResponse(text);
    botReply(res.text, res.quick || null);
  }

  /* -----------------------------------------------------------------------
     INICIALIZACIÓN
  ------------------------------------------------------------------------ */
  function init() {
    injectStyles();
    injectHTML();

    /* Referencias */
    var btn = $('lobos-chat-btn');
    var closeBtn = $('cb-close');
    var sendBtn = $('cb-send');
    var input = $('cb-input');

    /* Eventos */
    btn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);

    sendBtn.addEventListener('click', function () {
      var val = input.value;
      input.value = '';
      handleUserInput(val);
      input.focus();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var val = input.value;
        input.value = '';
        handleUserInput(val);
      }
    });

    /* Escape para cerrar */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });

    /* Restaurar historial */
    var history = loadHistory();
    if (history.length > 0) {
      history.forEach(function (m) { appendMessage(m.role, m.text, true); });
    } else {
      /* Mensaje de bienvenida con delay */
      setTimeout(function () {
        botReply(
          '¡Hola! 🐺 Bienvenido a Lobos de Montaña. Soy tu asistente virtual. ¿En qué puedo ayudarte?',
          QUICK_REPLIES_MAIN,
          1000
        );
      }, 1500);
    }
  }

  /* --- Language hook for i18n --- */
  window.lobosSetChatbotLang = function (lang) {
    // Update chatbot UI text based on language
    var headerTitle = document.querySelector('.cb-header-title');
    var headerSub = document.querySelector('.cb-header-sub');
    var input = $('cb-input');
    if (headerTitle) headerTitle.textContent = lang === 'en' ? 'Mountain Wolves' : 'Lobos de Montaña';
    if (headerSub) headerSub.textContent = lang === 'en' ? 'Virtual assistant • Online' : 'Asistente virtual • En línea';
    if (input) input.placeholder = lang === 'en' ? 'Type your message...' : 'Escribe tu mensaje…';
  };

  /* Arrancar al cargar el DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
