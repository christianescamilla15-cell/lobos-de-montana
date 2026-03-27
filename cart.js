/* ============================================================
   [INICIO] Branch: Indez-Destacados-Chris | Autor: Chris
   Descripcion: Sistema de carrito de compras en vanilla JS.
   Gestiona agregar/quitar productos, persistencia en localStorage,
   panel lateral slide-out, controles de cantidad y notificaciones.
   Se integra con las cards de producto-card y catalogo-card.
============================================================ */

(function () {
    'use strict';

    // ─── Storage key ───────────────────────────────────────────
    var STORAGE_KEY = 'lobos_carrito';

    // ─── DOM references ────────────────────────────────────────
    var overlay      = document.getElementById('carritoOverlay');
    var panel        = document.getElementById('carritoPanel');
    var body         = document.getElementById('carritoBody');
    var footer       = document.getElementById('carritoFooter');
    var totalEl      = document.getElementById('carritoTotal');
    var btnCerrar    = document.getElementById('carritoCerrar');
    var btnVaciar    = document.getElementById('carritoVaciar');
    var btnFinalizar = document.getElementById('carritoFinalizar');
    var badgeCount   = document.querySelector('.navbar-inicio__carrito-count');
    var cartLink     = document.querySelector('.navbar-inicio__carrito');

    // ─── Cart state ────────────────────────────────────────────
    var cart = loadCart();

    // ─── Initialization ────────────────────────────────────────
    renderCart();
    updateBadge();
    bindButtons();
    bindPanelControls();

    // ─── Load cart from localStorage ───────────────────────────
    function loadCart() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // ─── Save cart to localStorage ─────────────────────────────
    function saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    // ─── Get product data from a card element ──────────────────
    function getProductFromCard(card) {
        return {
            id:     card.dataset.id,
            nombre: card.dataset.nombre,
            precio: parseInt(card.dataset.precio, 10),
            img:    card.dataset.img
        };
    }

    // ─── Cart sound effect ─────────────────────────────────────
    function playCartSound() {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
        } catch(e) {}
    }

    // ─── Add item to cart ──────────────────────────────────────
    function addToCart(product, qty) {
        var quantity = qty || 1;
        var existing = cart.find(function (item) { return item.id === product.id; });
        if (existing) {
            existing.qty += quantity;
        } else {
            cart.push({
                id:     product.id,
                nombre: product.nombre,
                precio: product.precio,
                img:    product.img,
                qty:    quantity
            });
        }
        playCartSound();
        saveCart();
        renderCart();
        updateBadge();
    }

    // ─── Change quantity ───────────────────────────────────────
    function changeQty(id, delta) {
        var item = cart.find(function (i) { return i.id === id; });
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(function (i) { return i.id !== id; });
        }
        saveCart();
        renderCart();
        updateBadge();
    }

    // ─── Remove item ──────────────────────────────────────────
    function removeItem(id) {
        cart = cart.filter(function (i) { return i.id !== id; });
        saveCart();
        renderCart();
        updateBadge();
    }

    // ─── Clear cart ────────────────────────────────────────────
    function clearCart() {
        cart = [];
        saveCart();
        renderCart();
        updateBadge();
    }

    // ─── Calculate total ───────────────────────────────────────
    function getTotal() {
        return cart.reduce(function (sum, item) { return sum + item.precio * item.qty; }, 0);
    }

    // ─── Count total items ─────────────────────────────────────
    function getTotalItems() {
        return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    }

    // ─── Format price ──────────────────────────────────────────
    function formatPrice(n) {
        return '$' + n.toLocaleString('es-MX') + ' MXN';
    }

    // ─── Update navbar badge ───────────────────────────────────
    function updateBadge() {
        var count = getTotalItems();
        badgeCount.textContent = count;
        // Trigger bounce animation
        badgeCount.classList.remove('navbar-inicio__carrito-count--bounce');
        // Force reflow to restart animation
        void badgeCount.offsetWidth;
        badgeCount.classList.add('navbar-inicio__carrito-count--bounce');
    }

    // ─── Render cart panel content ─────────────────────────────
    function renderCart() {
        if (cart.length === 0) {
            body.innerHTML =
                '<div class="carrito-vacio">' +
                    '<i class="bi bi-cart-x carrito-vacio__icon"></i>' +
                    '<p class="carrito-vacio__texto">Tu carrito está vacío</p>' +
                '</div>';
            footer.style.display = 'none';
            totalEl.textContent = formatPrice(0);
            return;
        }

        footer.style.display = '';
        var html = '';
        cart.forEach(function (item) {
            var subtotal = item.precio * item.qty;
            html +=
                '<div class="carrito-item" data-item-id="' + item.id + '">' +
                    '<img class="carrito-item__img" src="' + item.img + '" alt="' + item.nombre + '">' +
                    '<div class="carrito-item__info">' +
                        '<div class="carrito-item__nombre" title="' + item.nombre + '">' + item.nombre + '</div>' +
                        '<div class="carrito-item__precio-unit">' + formatPrice(item.precio) + ' c/u</div>' +
                        '<div class="carrito-item__controles">' +
                            '<button class="carrito-item__btn-qty" data-action="minus" data-id="' + item.id + '">−</button>' +
                            '<span class="carrito-item__qty">' + item.qty + '</span>' +
                            '<button class="carrito-item__btn-qty" data-action="plus" data-id="' + item.id + '">+</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="carrito-item__right">' +
                        '<button class="carrito-item__eliminar" data-action="remove" data-id="' + item.id + '" title="Eliminar">' +
                            '<i class="bi bi-trash3"></i>' +
                        '</button>' +
                        '<div class="carrito-item__subtotal">' + formatPrice(subtotal) + '</div>' +
                    '</div>' +
                '</div>';
        });
        body.innerHTML = html;
        totalEl.textContent = formatPrice(getTotal());
    }

    // ─── Bind add-to-cart / buy buttons ────────────────────────
    function bindButtons() {
        document.addEventListener('click', function (e) {
            // Find the closest button (handles clicks on the <i> icon inside)
            var btn = e.target.closest('.btn-carrito, .btn-comprar');
            if (!btn) return;

            // Find the parent card with data attributes
            var card = btn.closest('[data-id]');
            if (!card) return;

            var product = getProductFromCard(card);

            if (btn.classList.contains('btn-carrito')) {
                addToCart(product);
                showToast(product.nombre + ' agregado al carrito');
            }

            if (btn.classList.contains('btn-comprar')) {
                addToCart(product);
                openCart();
            }
        });

        // Navbar cart icon opens panel
        if (cartLink) {
            cartLink.addEventListener('click', function (e) {
                e.preventDefault();
                openCart();
            });
        }
    }

    // ─── Bind panel internal controls ──────────────────────────
    function bindPanelControls() {
        // Delegated click for qty +/- and remove inside the panel body
        body.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-action]');
            if (!btn) return;

            var action = btn.dataset.action;
            var id     = btn.dataset.id;

            if (action === 'plus')   changeQty(id, 1);
            if (action === 'minus')  changeQty(id, -1);
            if (action === 'remove') removeItem(id);
        });

        // Close button
        btnCerrar.addEventListener('click', closeCart);

        // Overlay click
        overlay.addEventListener('click', closeCart);

        // Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel.classList.contains('carrito-panel--open')) {
                closeCart();
            }
        });

        // Clear cart
        btnVaciar.addEventListener('click', function () {
            clearCart();
            showToast('Carrito vaciado');
        });

        // Checkout — submit order to API
        btnFinalizar.addEventListener('click', async function () {
            if (cart.length === 0) {
                showToast('Tu carrito esta vacio');
                return;
            }
            var cartItems = cart.map(function (item) {
                return { id: item.id, name: item.nombre, price: item.precio, quantity: item.qty };
            });
            try {
                var res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: cartItems,
                        customer: { name: 'Cliente Web', email: 'pedido@lobosdemontana.mx' },
                        total: getTotal()
                    })
                });
                if (res.ok) {
                    showToast('Pedido recibido! Te contactaremos pronto.');
                    cart = [];
                    saveCart();
                    renderCart();
                    updateBadge();
                    closeCart();
                } else {
                    showToast('Error procesando pedido. Intenta de nuevo.');
                }
            } catch (err) {
                showToast('Error de conexion.');
            }
        });
    }

    // ─── Open / Close panel ────────────────────────────────────
    function openCart() {
        panel.classList.add('carrito-panel--open');
        overlay.classList.add('carrito-overlay--visible');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        panel.classList.remove('carrito-panel--open');
        overlay.classList.remove('carrito-overlay--visible');
        document.body.style.overflow = '';
    }

    // ─── Toast notification ────────────────────────────────────
    var toastTimer = null;

    function showToast(message) {
        // Reuse or create toast element
        var toast = document.querySelector('.carrito-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'carrito-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.remove('carrito-toast--visible');
        // Force reflow
        void toast.offsetWidth;
        toast.classList.add('carrito-toast--visible');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove('carrito-toast--visible');
        }, 2500);
    }

    // ─── Quick View Modal ──────────────────────────────────────
    (function initQuickView() {
        // Create overlay + modal
        var qvOverlay = document.createElement('div');
        qvOverlay.className = 'qv-overlay';
        qvOverlay.id = 'qvOverlay';
        qvOverlay.innerHTML =
            '<div class="qv-modal" id="qvModal">' +
                '<button class="qv-modal__close" id="qvClose" aria-label="Cerrar">&times;</button>' +
                '<img class="qv-modal__img" id="qvImg" src="" alt="">' +
                '<div class="qv-modal__body">' +
                    '<h3 class="qv-modal__name" id="qvName"></h3>' +
                    '<div class="qv-modal__price" id="qvPrice"></div>' +
                    '<p class="qv-modal__desc" id="qvDesc"></p>' +
                    '<div class="qv-modal__controls">' +
                        '<select class="qv-modal__select" id="qvSize" data-i18n-aria="quickview.size">' +
                            '<option value="S">S</option>' +
                            '<option value="M" selected>M</option>' +
                            '<option value="L">L</option>' +
                            '<option value="XL">XL</option>' +
                        '</select>' +
                        '<div class="qv-modal__qty-wrap">' +
                            '<button class="qv-modal__qty-btn" id="qvMinus">&minus;</button>' +
                            '<span class="qv-modal__qty-num" id="qvQty">1</span>' +
                            '<button class="qv-modal__qty-btn" id="qvPlus">+</button>' +
                        '</div>' +
                    '</div>' +
                    '<button class="btn btn-comprar w-100 py-2" id="qvAddCart">' +
                        '<i class="bi bi-cart-plus"></i> <span data-i18n="btn.addcart">Agregar al carrito</span>' +
                    '</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(qvOverlay);

        var qvModal = document.getElementById('qvModal');
        var qvClose = document.getElementById('qvClose');
        var qvImg = document.getElementById('qvImg');
        var qvName = document.getElementById('qvName');
        var qvPrice = document.getElementById('qvPrice');
        var qvDesc = document.getElementById('qvDesc');
        var qvQtyEl = document.getElementById('qvQty');
        var qvMinus = document.getElementById('qvMinus');
        var qvPlus = document.getElementById('qvPlus');
        var qvAddCart = document.getElementById('qvAddCart');

        var qvQty = 1;
        var qvProduct = null;

        function openQuickView(card) {
            var product = getProductFromCard(card);
            qvProduct = product;
            qvQty = 1;
            qvQtyEl.textContent = '1';
            qvImg.src = product.img;
            qvImg.alt = product.nombre;
            qvName.textContent = product.nombre;
            qvPrice.textContent = formatPrice(product.precio);

            // Try to get description from the card
            var descEl = card.querySelector('.producto-card__descripcion');
            if (descEl) {
                qvDesc.textContent = descEl.textContent;
                qvDesc.style.display = '';
            } else {
                qvDesc.textContent = '';
                qvDesc.style.display = 'none';
            }

            qvOverlay.classList.add('qv-overlay--visible');
            document.body.style.overflow = 'hidden';
        }

        function closeQuickView() {
            qvOverlay.classList.remove('qv-overlay--visible');
            document.body.style.overflow = '';
        }

        // Click on product images opens quick view
        document.addEventListener('click', function (e) {
            var imgArea = e.target.closest('.producto-card__imagen, .catalogo-card__imagen');
            if (!imgArea) return;
            // Don't open if clicking a button inside
            if (e.target.closest('.btn-carrito, .btn-comprar')) return;
            var card = imgArea.closest('[data-id]');
            if (card) {
                e.preventDefault();
                openQuickView(card);
            }
        });

        // Close handlers
        qvClose.addEventListener('click', closeQuickView);
        qvOverlay.addEventListener('click', function (e) {
            if (e.target === qvOverlay) closeQuickView();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && qvOverlay.classList.contains('qv-overlay--visible')) {
                closeQuickView();
            }
        });

        // Quantity controls
        qvMinus.addEventListener('click', function () {
            if (qvQty > 1) {
                qvQty--;
                qvQtyEl.textContent = qvQty;
            }
        });
        qvPlus.addEventListener('click', function () {
            qvQty++;
            qvQtyEl.textContent = qvQty;
        });

        // Add to cart from modal
        qvAddCart.addEventListener('click', function () {
            if (qvProduct) {
                addToCart(qvProduct, qvQty);
                showToast(qvProduct.nombre + ' agregado al carrito');
                closeQuickView();
            }
        });
    })();

    // ─── Wishlist System ───────────────────────────────────────
    (function initWishlist() {
        var WISHLIST_KEY = 'lobos_wishlist';

        function loadWishlist() {
            try {
                var data = localStorage.getItem(WISHLIST_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) { return []; }
        }

        function saveWishlist(wl) {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(wl));
        }

        var wishlist = loadWishlist();

        function updateWishlistBadge() {
            var badge = document.getElementById('wishlistBadge');
            if (badge) badge.textContent = wishlist.length;
        }

        function isInWishlist(id) {
            return wishlist.some(function (item) { return item.id === id; });
        }

        function toggleWishlist(product) {
            if (isInWishlist(product.id)) {
                wishlist = wishlist.filter(function (item) { return item.id !== product.id; });
                showToast('Eliminado de favoritos');
            } else {
                wishlist.push(product);
                showToast('Agregado a favoritos');
            }
            saveWishlist(wishlist);
            updateWishlistBadge();
            updateHearts();
        }

        function updateHearts() {
            document.querySelectorAll('.wishlist-heart').forEach(function (btn) {
                var id = btn.dataset.wishlistId;
                if (isInWishlist(id)) {
                    btn.classList.add('active');
                    btn.innerHTML = '<i class="bi bi-heart-fill"></i>';
                } else {
                    btn.classList.remove('active');
                    btn.innerHTML = '<i class="bi bi-heart"></i>';
                }
            });
        }

        // Add heart buttons to all product cards
        document.querySelectorAll('.producto-card__imagen, .catalogo-card__imagen').forEach(function (imgDiv) {
            var card = imgDiv.closest('[data-id]');
            if (!card) return;
            var btn = document.createElement('button');
            btn.className = 'wishlist-heart';
            btn.dataset.wishlistId = card.dataset.id;
            btn.innerHTML = '<i class="bi bi-heart"></i>';
            btn.setAttribute('aria-label', 'Agregar a favoritos');
            imgDiv.style.position = 'relative';
            imgDiv.appendChild(btn);
        });

        // Click handler for hearts
        document.addEventListener('click', function (e) {
            var heartBtn = e.target.closest('.wishlist-heart');
            if (!heartBtn) return;
            e.stopPropagation();
            e.preventDefault();
            var card = heartBtn.closest('[data-id]');
            if (!card) return;
            toggleWishlist(getProductFromCard(card));
        });

        // Navbar wishlist button
        var navWishlistBtn = document.getElementById('navWishlistBtn');
        if (navWishlistBtn) {
            navWishlistBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (wishlist.length === 0) {
                    showToast('Tu lista de favoritos esta vacia');
                } else {
                    showToast('Tienes ' + wishlist.length + ' favoritos');
                }
            });
        }

        updateWishlistBadge();
        updateHearts();
    })();

    // ─── Size Guide Link in Quick View ───────────────────────
    (function initSizeGuide() {
        // Wait for quick view modal to be in DOM
        var interval = setInterval(function () {
            var qvControls = document.querySelector('.qv-modal__controls');
            if (!qvControls) return;
            clearInterval(interval);

            // Add size guide link after controls
            var link = document.createElement('button');
            link.className = 'qv-size-guide-link';
            link.setAttribute('data-i18n', 'sizeguide.link');
            link.textContent = 'Guia de tallas';
            link.addEventListener('click', function () {
                var overlay = document.getElementById('sizeGuideOverlay');
                if (overlay) {
                    overlay.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
            qvControls.parentNode.insertBefore(link, qvControls.nextSibling);
        }, 200);
    })();

})();

/* [FIN] Cart JS - Indez-Destacados-Chris */
