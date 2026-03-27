/**
 * audio.js — Lobos de Montana
 * Ambient nature music system with toggle, volume slider, fallback to generated wind
 */
(function () {
  'use strict';

  var AUDIO_URL = 'https://cdn.freesound.org/previews/531/531015_6519378-lq.mp3';
  var STORAGE_KEY = 'lobos_audio_muted';
  var FADE_DURATION = 800; // ms

  var isMuted = localStorage.getItem(STORAGE_KEY) === 'true';
  var audioCtx = null;
  var gainNode = null;
  var audioElement = null;
  var sourceNode = null;
  var isPlaying = false;
  var useFallback = false;
  var fallbackOsc = null;
  var fallbackFilter = null;
  var initialized = false;

  // ── Create the toggle button ──────────────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'lm-audio-toggle';
  btn.setAttribute('aria-label', 'Toggle ambient music');
  btn.setAttribute('data-i18n-aria', 'audio.toggle');
  btn.title = 'Ambient Music';
  btn.innerHTML = getSpeakerSVG(!isMuted);

  // ── Volume slider container ───────────────────────────────────────
  var sliderWrap = document.createElement('div');
  sliderWrap.id = 'lm-audio-slider-wrap';

  var slider = document.createElement('input');
  slider.type = 'range';
  slider.id = 'lm-audio-slider';
  slider.min = '0';
  slider.max = '100';
  slider.value = '30';
  slider.setAttribute('aria-label', 'Volume');
  slider.setAttribute('data-i18n-aria', 'audio.volume');
  sliderWrap.appendChild(slider);

  var container = document.createElement('div');
  container.id = 'lm-audio-container';
  container.appendChild(sliderWrap);
  container.appendChild(btn);

  // ── Inject styles ─────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = `
#lm-audio-container {
  position: fixed;
  bottom: 90px;
  left: 20px;
  z-index: 1030;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
#lm-audio-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #A9C0DE;
  background: #161F28;
  color: #A9C0DE;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
#lm-audio-toggle:hover {
  background: #1E3765;
  border-color: #D3DFE8;
  transform: scale(1.1);
}
#lm-audio-toggle svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
#lm-audio-slider-wrap {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  background: #161F28;
  border: 1px solid rgba(169,192,222,0.2);
  border-radius: 20px;
  padding: 12px 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
#lm-audio-container:hover #lm-audio-slider-wrap {
  opacity: 1;
  visibility: visible;
}
#lm-audio-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 80px;
  height: 4px;
  background: #1E3765;
  border-radius: 2px;
  outline: none;
  writing-mode: vertical-lr;
  direction: rtl;
}
#lm-audio-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #A9C0DE;
  cursor: pointer;
  border: none;
}
#lm-audio-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #A9C0DE;
  cursor: pointer;
  border: none;
}
@media (prefers-reduced-motion: reduce) {
  #lm-audio-toggle { transition: none; }
  #lm-audio-slider-wrap { transition: none; }
}
`;
  document.head.appendChild(style);

  // ── Wait for DOM ready ────────────────────────────────────────────
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    document.body.appendChild(container);

    // Start audio on first user interaction anywhere
    document.addEventListener('click', initAudioOnce, { once: false });
    document.addEventListener('touchstart', initAudioOnce, { once: false });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMute();
    });

    slider.addEventListener('input', function () {
      if (gainNode) {
        var vol = parseInt(slider.value, 10) / 100;
        gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
      }
    });
  });

  // ── Initialize audio on first interaction ─────────────────────────
  function initAudioOnce() {
    if (initialized) return;
    initialized = true;

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);

      var startVol = isMuted ? 0 : parseInt(slider.value, 10) / 100;
      gainNode.gain.setValueAtTime(startVol, audioCtx.currentTime);

      // Try loading the audio file
      audioElement = new Audio();
      audioElement.crossOrigin = 'anonymous';
      audioElement.loop = true;
      audioElement.src = AUDIO_URL;

      audioElement.addEventListener('canplaythrough', function () {
        if (useFallback) return; // already fell back
        sourceNode = audioCtx.createMediaElementSource(audioElement);
        sourceNode.connect(gainNode);
        audioElement.play().catch(function () {});
        isPlaying = true;
        if (!isMuted) fadeIn();
      }, { once: true });

      audioElement.addEventListener('error', function () {
        useFallback = true;
        startFallbackWind();
      });

      // Timeout fallback — if audio doesn't load in 5s, use generated wind
      setTimeout(function () {
        if (!isPlaying && !useFallback) {
          useFallback = true;
          startFallbackWind();
        }
      }, 5000);

    } catch (e) {
      // AudioContext not supported
    }

    // Remove the listeners after first init
    document.removeEventListener('click', initAudioOnce);
    document.removeEventListener('touchstart', initAudioOnce);
  }

  // ── Fallback: generated wind noise ────────────────────────────────
  function startFallbackWind() {
    if (!audioCtx || !gainNode) return;

    // Create white noise buffer
    var bufferSize = audioCtx.sampleRate * 4;
    var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    var noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Low-pass filter to make it sound like wind
    fallbackFilter = audioCtx.createBiquadFilter();
    fallbackFilter.type = 'lowpass';
    fallbackFilter.frequency.setValueAtTime(400, audioCtx.currentTime);
    fallbackFilter.Q.setValueAtTime(1, audioCtx.currentTime);

    noise.connect(fallbackFilter);
    fallbackFilter.connect(gainNode);
    noise.start();
    isPlaying = true;
    fallbackOsc = noise;

    if (!isMuted) fadeIn();
  }

  // ── Fade in/out ───────────────────────────────────────────────────
  function fadeIn() {
    if (!gainNode || !audioCtx) return;
    var targetVol = parseInt(slider.value, 10) / 100;
    gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(targetVol, audioCtx.currentTime + FADE_DURATION / 1000);
  }

  function fadeOut() {
    if (!gainNode || !audioCtx) return;
    gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + FADE_DURATION / 1000);
  }

  // ── Toggle mute ───────────────────────────────────────────────────
  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem(STORAGE_KEY, isMuted ? 'true' : 'false');
    btn.innerHTML = getSpeakerSVG(!isMuted);

    if (!initialized) {
      initAudioOnce();
      return;
    }

    if (isMuted) {
      fadeOut();
    } else {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      fadeIn();
    }
  }

  // ── SVG icons ─────────────────────────────────────────────────────
  function getSpeakerSVG(on) {
    if (on) {
      return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
  }

})();
