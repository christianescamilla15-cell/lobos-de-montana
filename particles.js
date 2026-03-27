/**
 * particles.js — Lobos de Montana
 * Subtle falling snow particles in the hero section only
 * Uses canvas, respects prefers-reduced-motion, pauses when offscreen
 */
(function () {
  'use strict';

  // ── Respect reduced motion ──────────────────────────────────────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var PARTICLE_COUNT = 50;
  var MIN_SIZE = 2;
  var MAX_SIZE = 4;
  var MIN_OPACITY = 0.3;
  var MAX_OPACITY = 0.5;
  var FALL_SPEED_MIN = 0.3;
  var FALL_SPEED_MAX = 0.8;
  var DRIFT_AMPLITUDE = 0.5;
  var DRIFT_FREQUENCY = 0.01;

  var canvas, ctx, particles, animFrame;
  var heroEl = null;
  var isVisible = false;
  var width = 0, height = 0;

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    heroEl = document.getElementById('slogan');
    if (!heroEl) return;

    // Make hero position relative if not already
    var heroPos = getComputedStyle(heroEl).position;
    if (heroPos === 'static') {
      heroEl.style.position = 'relative';
    }

    // Create canvas
    canvas = document.createElement('canvas');
    canvas.id = 'lm-snow-canvas';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;';
    heroEl.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // Size canvas
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    initParticles();

    // Intersection observer to pause when offscreen
    var observer = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !animFrame) {
        animFrame = requestAnimationFrame(loop);
      }
    }, { threshold: 0 });
    observer.observe(heroEl);
  });

  function resize() {
    if (!heroEl || !canvas) return;
    width = heroEl.offsetWidth;
    height = heroEl.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(true));
    }
  }

  function createParticle(randomY) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -MAX_SIZE,
      size: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),
      opacity: MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY),
      speed: FALL_SPEED_MIN + Math.random() * (FALL_SPEED_MAX - FALL_SPEED_MIN),
      driftOffset: Math.random() * 1000,
      driftAmp: DRIFT_AMPLITUDE * (0.5 + Math.random() * 0.5)
    };
  }

  function loop() {
    if (!isVisible) {
      animFrame = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Update position
      p.y += p.speed;
      p.x += Math.sin((p.y + p.driftOffset) * DRIFT_FREQUENCY) * p.driftAmp;

      // Reset if out of bounds
      if (p.y > height + p.size || p.x < -p.size || p.x > width + p.size) {
        particles[i] = createParticle(false);
        particles[i].x = Math.random() * width;
        continue;
      }

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + p.opacity + ')';
      ctx.fill();
    }

    animFrame = requestAnimationFrame(loop);
  }

})();
