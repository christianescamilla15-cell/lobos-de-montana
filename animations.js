/**
 * animations.js — Lobos de Montana
 * Premium scroll-triggered animations & micro-interactions
 * Vanilla JS, self-contained (injects its own CSS)
 */
(function () {
  'use strict';

  // ── Color tokens ──────────────────────────────────────────────────
  const COLOR_FONDO  = '#161F28';
  const COLOR_ACENTO = '#A9C0DE';

  // ── Reduced-motion check ──────────────────────────────────────────
  const prefersReduced =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ════════════════════════════════════════════════════════════════════
  // 1. INJECT CSS
  // ════════════════════════════════════════════════════════════════════
  const css = `
/* ── Loading overlay ─────────────────────────────────────────────── */
.lm-loader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: ${COLOR_FONDO};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity .6s ease, visibility .6s ease;
}
.lm-loader.lm-loader--hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.lm-loader__spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(169,192,222,.15);
  border-top-color: ${COLOR_ACENTO};
  border-radius: 50%;
  animation: lm-spin .8s linear infinite;
}
@keyframes lm-spin { to { transform: rotate(360deg); } }

/* ── Scroll progress bar ─────────────────────────────────────────── */
.lm-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, ${COLOR_ACENTO}, #d4e3f5);
  width: 0%;
  z-index: 10000;
  transition: none;
  pointer-events: none;
}

/* ── Reveal animations ───────────────────────────────────────────── */
.lm-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity .7s cubic-bezier(.22,1,.36,1),
              transform .7s cubic-bezier(.22,1,.36,1);
}
.lm-reveal--visible {
  opacity: 1;
  transform: translateY(0);
}

.lm-reveal-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity .7s cubic-bezier(.22,1,.36,1),
              transform .7s cubic-bezier(.22,1,.36,1);
}
.lm-reveal-left--visible {
  opacity: 1;
  transform: translateX(0);
}

/* ── Card tilt ───────────────────────────────────────────────────── */
.lm-tilt {
  transition: transform .15s ease-out, box-shadow .3s ease;
  will-change: transform;
}
.lm-tilt:hover {
  box-shadow: 0 20px 40px rgba(0,0,0,.35);
}

/* ── Magnetic button ─────────────────────────────────────────────── */
.lm-magnetic {
  transition: transform .2s ease-out;
  will-change: transform;
}

/* ── Navbar scroll state ─────────────────────────────────────────── */
.navbar-inicio.lm-nav--scrolled {
  background: rgba(22,31,40,.95) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0,0,0,.3);
}

/* ── Active nav link ─────────────────────────────────────────────── */
.lm-nav-active {
  color: ${COLOR_ACENTO} !important;
  position: relative;
}

/* ── Counter ─────────────────────────────────────────────────────── */
.lm-counter {
  display: inline-block;
}

/* ── Reduced motion override ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .lm-reveal,
  .lm-reveal-left,
  .lm-tilt,
  .lm-magnetic {
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
  .lm-loader__spinner {
    animation: none;
  }
  .lm-progress {
    display: none;
  }
}
`;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ════════════════════════════════════════════════════════════════════
  // 5. LOADING OVERLAY (branded with progress bar)
  // ════════════════════════════════════════════════════════════════════
  // Check if the branded loader exists in HTML first
  const brandedLoader = document.getElementById('lm-loader');
  const loaderBar = document.getElementById('lm-loader-bar');

  if (brandedLoader && loaderBar) {
    // Animate the branded loader bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) progress = 100;
      loaderBar.style.width = progress + '%';
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          brandedLoader.style.opacity = '0';
          setTimeout(() => brandedLoader.remove(), 600);
        }, 400);
      }
    }, 200);
  } else {
    // Fallback: create simple spinner loader
    const loader = document.createElement('div');
    loader.className = 'lm-loader';
    loader.innerHTML = '<div class="lm-loader__spinner"></div>';
    document.body.prepend(loader);

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('lm-loader--hidden');
      }, 300);
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 1000);
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // 4-c. SCROLL PROGRESS BAR
  // ════════════════════════════════════════════════════════════════════
  const progressBar = document.createElement('div');
  progressBar.className = 'lm-progress';
  document.body.prepend(progressBar);

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  // ════════════════════════════════════════════════════════════════════
  // Wait for DOM ready
  // ════════════════════════════════════════════════════════════════════
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    // If reduced motion, make everything visible immediately and bail
    if (prefersReduced) {
      document.querySelectorAll(
        '.productos-destacados__titulo,.catalogo__titulo,.nosotros__titulo,.contacto__titulo,' +
        '.producto-card,.catalogo-card,.nosotros__stat-num,.contacto__info-item,' +
        '.contacto__form input,.contacto__form textarea,.contacto__form select,.contacto__form button'
      ).forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // ══════════════════════════════════════════════════════════════════
    // 1-a. FADE-IN-UP FOR SECTION TITLES
    // ══════════════════════════════════════════════════════════════════
    var titles = document.querySelectorAll(
      '.productos-destacados__titulo, .catalogo__titulo, .nosotros__titulo, .contacto__titulo'
    );
    titles.forEach(function (el) {
      el.classList.add('lm-reveal');
    });

    // ══════════════════════════════════════════════════════════════════
    // 1-b. STAGGERED CARD ENTRANCE
    // ══════════════════════════════════════════════════════════════════
    var cards = document.querySelectorAll('.producto-card, .catalogo-card');
    cards.forEach(function (el, i) {
      el.classList.add('lm-reveal');
      el.style.transitionDelay = (i % 6) * 120 + 'ms';
    });

    // ══════════════════════════════════════════════════════════════════
    // 1-d. CONTACT INFO SLIDE-IN FROM LEFT
    // ══════════════════════════════════════════════════════════════════
    var contactItems = document.querySelectorAll('.contacto__info-item');
    contactItems.forEach(function (el, i) {
      el.classList.add('lm-reveal-left');
      el.style.transitionDelay = i * 100 + 'ms';
    });

    // ══════════════════════════════════════════════════════════════════
    // 1-e. FORM INPUTS FADE IN SEQUENTIALLY
    // ══════════════════════════════════════════════════════════════════
    var formFields = document.querySelectorAll(
      '.contacto__form input, .contacto__form textarea, .contacto__form select, .contacto__form button'
    );
    formFields.forEach(function (el, i) {
      el.classList.add('lm-reveal');
      el.style.transitionDelay = i * 80 + 'ms';
    });

    // ══════════════════════════════════════════════════════════════════
    // INTERSECTION OBSERVER — triggers reveal classes
    // ══════════════════════════════════════════════════════════════════
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            if (el.classList.contains('lm-reveal')) {
              el.classList.add('lm-reveal--visible');
            }
            if (el.classList.contains('lm-reveal-left')) {
              el.classList.add('lm-reveal-left--visible');
            }
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.lm-reveal, .lm-reveal-left').forEach(function (el) {
      revealObserver.observe(el);
    });

    // ══════════════════════════════════════════════════════════════════
    // 1-c. STATS COUNTER ANIMATION
    // ══════════════════════════════════════════════════════════════════
    var statNums = document.querySelectorAll('.nosotros__stat-num');

    function parseTarget(el) {
      var raw = el.textContent.trim();
      var suffix = '';
      var num = 0;
      // e.g. "500+", "10K+", "32"
      if (raw.indexOf('K') !== -1) {
        num = parseFloat(raw) * 1000;
        suffix = raw.replace(/[\d.,]+/g, ''); // "K+"
      } else {
        num = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
        suffix = raw.replace(/[\d.,]+/g, ''); // "+"
      }
      return { num: num, suffix: suffix, raw: raw };
    }

    function formatNum(n, suffix, raw) {
      if (raw.indexOf('K') !== -1) {
        var k = n / 1000;
        return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + suffix;
      }
      return Math.floor(n) + suffix;
    }

    function animateCounter(el, target, suffix, raw) {
      var duration = 1800;
      var start = performance.now();
      function step(now) {
        var t = Math.min((now - start) / duration, 1);
        // ease-out quad
        var eased = 1 - (1 - t) * (1 - t);
        var current = eased * target;
        el.textContent = formatNum(current, suffix, raw);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var data = parseTarget(el);
            el.classList.add('lm-reveal--visible');
            animateCounter(el, data.num, data.suffix, data.raw);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNums.forEach(function (el) {
      el.classList.add('lm-reveal');
      counterObserver.observe(el);
    });

    // ══════════════════════════════════════════════════════════════════
    // 2. PARALLAX on .hero-slogan
    // ══════════════════════════════════════════════════════════════════
    var heroSlogan = document.querySelector('.hero-slogan');

    function updateParallax() {
      if (!heroSlogan) return;
      var scrollY = window.scrollY || window.pageYOffset;
      var speed = 0.35;
      heroSlogan.style.transform = 'translateY(' + scrollY * speed + 'px)';
    }

    // ══════════════════════════════════════════════════════════════════
    // 3. NAVBAR — opaque on scroll + active link highlighting
    // ══════════════════════════════════════════════════════════════════
    var navbar = document.querySelector('.navbar-inicio');
    var navLinks = document.querySelectorAll('.navbar-inicio a[href^="#"]');
    var sectionIds = [
      'hero',
      'productos-destacados',
      'catalogo',
      'nosotros',
      'contacto',
      'footer'
    ];

    function updateNavbar() {
      if (!navbar) return;
      var scrollY = window.scrollY || window.pageYOffset;

      // Background opacity
      if (scrollY > 60) {
        navbar.classList.add('lm-nav--scrolled');
      } else {
        navbar.classList.remove('lm-nav--scrolled');
      }

      // Active link
      var currentId = '';
      for (var i = sectionIds.length - 1; i >= 0; i--) {
        var sec = document.getElementById(sectionIds[i]);
        if (sec) {
          var rect = sec.getBoundingClientRect();
          if (rect.top <= 150) {
            currentId = sectionIds[i];
            break;
          }
        }
      }

      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === '#' + currentId) {
          link.classList.add('lm-nav-active');
        } else {
          link.classList.remove('lm-nav-active');
        }
      });
    }

    // ══════════════════════════════════════════════════════════════════
    // UNIFIED SCROLL HANDLER (throttled via rAF)
    // ══════════════════════════════════════════════════════════════════
    var ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            updateProgress();
            updateParallax();
            updateNavbar();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    // Initial calls
    updateProgress();
    updateNavbar();

    // ══════════════════════════════════════════════════════════════════
    // 4-a. PRODUCT CARD TILT (3D perspective)
    // ══════════════════════════════════════════════════════════════════
    var tiltCards = document.querySelectorAll('.producto-card, .catalogo-card');
    tiltCards.forEach(function (card) {
      card.classList.add('lm-tilt');
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform =
          'perspective(800px) rotateX(' +
          rotateX +
          'deg) rotateY(' +
          rotateY +
          'deg) scale3d(1.02,1.02,1.02)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform =
          'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });

    // ══════════════════════════════════════════════════════════════════
    // 4-b. MAGNETIC BUTTON on .hero-slogan__cta
    // ══════════════════════════════════════════════════════════════════
    var magneticBtns = document.querySelectorAll('.hero-slogan__cta');
    magneticBtns.forEach(function (btn) {
      btn.classList.add('lm-magnetic');

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - (rect.left + rect.width / 2);
        var y = e.clientY - (rect.top + rect.height / 2);
        var pull = 0.3; // strength
        btn.style.transform =
          'translate(' + x * pull + 'px, ' + y * pull + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0, 0)';
      });
    });
    // ══════════════════════════════════════════════════════════════════
    // LIVE VISITORS COUNTER
    // ══════════════════════════════════════════════════════════════════
    var visitorEl = document.getElementById('visitor-count');
    if (visitorEl) {
      var vCount = Math.floor(Math.random() * 80) + 180;
      visitorEl.textContent = vCount;
      setInterval(function () {
        vCount += Math.floor(Math.random() * 7) - 3;
        if (vCount < 150) vCount = 150 + Math.floor(Math.random() * 20);
        if (vCount > 300) vCount = 300 - Math.floor(Math.random() * 20);
        visitorEl.textContent = vCount;
      }, 5000);
    }

    // ══════════════════════════════════════════════════════════════════
    // COUNTDOWN TIMER (resets every 24h, stored in localStorage)
    // ══════════════════════════════════════════════════════════════════
    var countdownEl = document.getElementById('countdown-timer');
    if (countdownEl) {
      var CD_KEY = 'lobos_countdown_end';
      var endTime = parseInt(localStorage.getItem(CD_KEY), 10);
      var now = Date.now();
      if (!endTime || endTime <= now) {
        endTime = now + 24 * 60 * 60 * 1000;
        localStorage.setItem(CD_KEY, endTime.toString());
      }
      function updateCountdown() {
        var diff = endTime - Date.now();
        if (diff <= 0) {
          endTime = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem(CD_KEY, endTime.toString());
          diff = endTime - Date.now();
        }
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        countdownEl.textContent =
          (h < 10 ? '0' : '') + h + ':' +
          (m < 10 ? '0' : '') + m + ':' +
          (s < 10 ? '0' : '') + s;
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }

    // ══════════════════════════════════════════════════════════════════
    // NEWSLETTER POPUP (30s delay, once per session)
    // ══════════════════════════════════════════════════════════════════
    if (!sessionStorage.getItem('lobos_newsletter_shown')) {
      setTimeout(function () {
        var popup = document.getElementById('newsletterPopup');
        if (popup) {
          popup.style.display = 'flex';
          sessionStorage.setItem('lobos_newsletter_shown', '1');
        }
      }, 30000);
    }

    // ══════════════════════════════════════════════════════════════════
    // BACK TO TOP BUTTON
    // ══════════════════════════════════════════════════════════════════
    var backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      window.addEventListener('scroll', function () {
        if ((window.scrollY || window.pageYOffset) > 500) {
          backToTopBtn.style.display = 'flex';
          backToTopBtn.style.opacity = '1';
        } else {
          backToTopBtn.style.opacity = '0';
          setTimeout(function () {
            if ((window.scrollY || window.pageYOffset) <= 500) {
              backToTopBtn.style.display = 'none';
            }
          }, 300);
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

  }); // end onReady
})();
