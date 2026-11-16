/* STUZEN — cinematic intro timeline (vanilla JS, no dependencies). */
(function () {
  'use strict';

  var intro = document.getElementById('stuzen-intro');
  if (!intro) return;

  var root = document.documentElement;
  var STORAGE_KEY = 'stuzen-intro-v1';
  var reduceMotion = false;

  try {
    reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (error) { /* matchMedia is optional */ }

  function remember() {
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (error) { /* storage may be blocked */ }
  }

  function unlockPage() {
    root.classList.remove('si-lock');
    root.classList.remove('si-armed');
  }

  function dismissNow() {
    unlockPage();
    if (intro.parentNode) intro.parentNode.removeChild(intro);
  }

  /* Reduced motion or a repeat visit in this session: reveal the site instantly. */
  if (reduceMotion || root.classList.contains('si-intro-off')) {
    remember();
    dismissNow();
    return;
  }

  remember();

  var cores = navigator.hardwareConcurrency || 8;
  var memory = navigator.deviceMemory || 8;
  var lite = cores <= 4 || memory <= 4 || window.innerWidth < 360;
  if (lite) intro.classList.add('si-lite');

  var timers = [];
  var finished = false;
  var skipButton = intro.querySelector('[data-si-skip]');
  var chapter = document.getElementById('si-chapter');
  var typed = document.getElementById('si-typed');
  var letters = typed ? Array.prototype.slice.call(typed.querySelectorAll('.si-screen__letter')) : [];
  var wordmark = document.getElementById('si-wordmark');

  function at(milliseconds, callback) {
    timers.push(window.setTimeout(callback, milliseconds));
  }

  function setPhase(phase) {
    intro.setAttribute('data-phase', phase);
    if (!chapter) return;
    var labels = {
      world: '01 / Digital world',
      converge: '02 / Integration',
      typing: '03 / Identity',
      logo: '04 / Reveal',
      reveal: '05 / Experience'
    };
    if (labels[phase]) chapter.textContent = labels[phase];
  }

  root.classList.add('si-lock');
  root.classList.add('si-started');

  /* ---------- Canvas particles ---------- */
  function createParticles() {
    var canvas = document.getElementById('si-particles');
    if (!canvas || !canvas.getContext) return { converge: function () {}, stop: function () {} };

    var context = canvas.getContext('2d');
    if (!context) return { converge: function () {}, stop: function () {} };

    var dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
    var width = 0;
    var height = 0;
    var particles = [];
    var convergeStart = 0;
    var raf = 0;
    var running = false;
    var stopped = false;

    function build() {
      var count = lite ? 22 : (width < 700 ? 42 : 76);
      particles = [];
      for (var i = 0; i < count; i += 1) {
        var accent = Math.random() > 0.78;
        particles.push({
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          radius: accent ? 1.2 + Math.random() * 1.2 : 0.5 + Math.random() * 1.1,
          alpha: 0.18 + Math.random() * 0.52,
          drift: 8 + Math.random() * 22,
          speed: 0.16 + Math.random() * 0.34,
          phase: Math.random() * Math.PI * 2,
          color: accent ? 'rgba(191, 219, 254, ' : (Math.random() > 0.5 ? 'rgba(147, 197, 253, ' : 'rgba(226, 239, 255, ')
        });
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function frame(now) {
      if (!running) return;
      context.clearRect(0, 0, width, height);
      var seconds = now * 0.001;
      var progress = convergeStart ? Math.min(1, (now - convergeStart) / 1150) : 0;
      var eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      var centerX = width * 0.5;
      var centerY = height * 0.455;

      for (var i = 0; i < particles.length; i += 1) {
        var particle = particles[i];
        var x = particle.baseX + Math.sin(seconds * particle.speed + particle.phase) * particle.drift;
        var y = particle.baseY + Math.cos(seconds * particle.speed * 0.8 + particle.phase) * particle.drift * 0.7;
        var radius = particle.radius;
        var alpha = particle.alpha;

        if (progress > 0) {
          var angle = Math.atan2(y - centerY, x - centerX) + eased * 1.55;
          var distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) * (1 - eased);
          x = centerX + Math.cos(angle) * distance;
          y = centerY + Math.sin(angle) * distance;
          radius = particle.radius * (1 - eased * 0.75);
          alpha = particle.alpha * (1 - eased * 0.35);
        }

        context.globalAlpha = alpha;
        context.fillStyle = particle.color + '1)';
        context.beginPath();
        context.arc(x, y, Math.max(0.2, radius), 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      if (progress < 1) {
        raf = window.requestAnimationFrame(frame);
      } else {
        running = false;
        context.clearRect(0, 0, width, height);
      }
    }

    function start() {
      if (running || stopped) return;
      running = true;
      raf = window.requestAnimationFrame(frame);
    }

    function converge() {
      if (stopped) return;
      convergeStart = window.performance && performance.now ? performance.now() : Date.now();
      start();
    }

    function stop() {
      stopped = true;
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      context.clearRect(0, 0, width, height);
      window.removeEventListener('resize', resize);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    start();

    return { converge: converge, stop: stop };
  }

  var particles = createParticles();

  /* ---------- Skip controls ---------- */
  function finish(immediate) {
    if (finished) return;
    finished = true;

    timers.forEach(function (timer) { window.clearTimeout(timer); });
    timers = [];
    particles.stop();

    if (skipButton) skipButton.removeEventListener('click', onSkip);
    document.removeEventListener('keydown', onKeydown);

    if (immediate) intro.style.transitionDuration = '.3s';
    intro.classList.add('is-exiting');
    intro.setAttribute('aria-hidden', 'true');
    unlockPage();

    window.setTimeout(function () {
      if (intro.parentNode) intro.parentNode.removeChild(intro);
    }, immediate ? 320 : 900);
  }

  function onSkip(event) {
    if (event) event.preventDefault();
    finish(true);
  }

  function onKeydown(event) {
    if (event.key === 'Escape') finish(true);
  }

  if (skipButton) skipButton.addEventListener('click', onSkip);
  document.addEventListener('keydown', onKeydown);

  /* ---------- Timeline ---------- */
  window.requestAnimationFrame(function () {
    intro.classList.add('is-awake');
    setPhase('world');
  });

  at(1200, function () {
    setPhase('converge');
    intro.classList.add('is-converging');
    particles.converge();
  });

  at(2300, function () {
    setPhase('typing');
    particles.stop();
  });

  var typeDelays = [90, 125, 105, 155, 95, 145];
  var typeClock = 2850;

  letters.forEach(function (letter, index) {
    typeClock += typeDelays[index] || 110;
    at(typeClock, function () {
      letter.classList.add('is-typed');
      if (typed) typed.style.setProperty('--si-caret', String(index + 1));
    });
  });

  at(typeClock + 160, function () {
    if (typed) typed.classList.add('is-complete');
  });

  at(3950, function () {
    if (!typed || !wordmark) {
      setPhase('logo');
      return;
    }

    /* Shared-element style hand-off: the typed word lifts off the phone and
       becomes the wordmark beneath the original STUZEN icon. */
    var typedRect = typed.getBoundingClientRect();
    var targetRect = wordmark.getBoundingClientRect();
    var typedX = typedRect.left + typedRect.width / 2;
    var typedY = typedRect.top + typedRect.height / 2;
    var targetX = targetRect.left + targetRect.width / 2;
    var targetY = targetRect.top + targetRect.height / 2;
    var shiftX = typedX - targetX;
    var shiftY = typedY - targetY;
    var startScale = Math.max(0.2, Math.min(1.6, typedRect.width / Math.max(1, targetRect.width)));

    setPhase('logo');

    wordmark.style.opacity = '1';
    if (wordmark.animate) {
      wordmark.animate(
        [
          { transform: 'translate(' + shiftX + 'px, ' + shiftY + 'px) scale(' + startScale + ')', opacity: 0.18, filter: 'blur(3px)' },
          { transform: 'translate(0, 0) scale(1)', opacity: 1, filter: 'blur(0px)' }
        ],
        { duration: 1080, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' }
      );
    }
  });

  at(5750, function () {
    setPhase('reveal');
  });

  at(6650, function () {
    finish(false);
  });
})();
