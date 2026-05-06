(function () {
  'use strict';

  /* ── config ── */
  var MOBILE_PARTICLES  = 40;
  var DESKTOP_PARTICLES = 120;
  var CONNECT_DIST      = 140;
  var MOUSE_RADIUS      = 110;
  var COLOR             = '0, 209, 255';

  /* ── state ── */
  var canvas, ctx;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var animId, W, H;

  /* ── helpers ── */
  function particleCount() {
    return window.innerWidth < 768 ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  /* ── canvas ── */
  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'particlesCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;inset:0;z-index:-18;pointer-events:none;transform:translateZ(0);';
    document.body.prepend(canvas);
    ctx = canvas.getContext('2d');
  }

  function resizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ── particles ── */
  function spawnParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: rand(-0.45, 0.45),
      vy: rand(-0.45, 0.45),
      r:  rand(1.0, 2.2)
    };
  }

  function syncParticleCount() {
    var target = particleCount();
    while (particles.length < target) particles.push(spawnParticle());
    while (particles.length > target) particles.pop();
  }

  /* ── update ── */
  function update() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      /* drift */
      p.x += p.vx;
      p.y += p.vy;

      /* wrap */
      if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;

      /* mouse repulsion */
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < MOUSE_RADIUS * MOUSE_RADIUS && d2 > 0.01) {
        var d = Math.sqrt(d2);
        var force = (MOUSE_RADIUS - d) / MOUSE_RADIUS;
        p.x += (dx / d) * force * 1.6;
        p.y += (dy / d) * force * 1.6;
      }
    }
  }

  /* ── draw ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* connections */
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d2 = dx * dx + dy * dy;
        if (d2 < CONNECT_DIST * CONNECT_DIST) {
          var alpha = (1 - Math.sqrt(d2) / CONNECT_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + COLOR + ',' + alpha.toFixed(3) + ')';
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }
    }

    /* dots */
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + COLOR + ', 0.62)';
      ctx.fill();
    }
  }

  /* ── loop ── */
  function tick() {
    if (!animId) return;
    update();
    draw();
    animId = requestAnimationFrame(tick);
  }

  function play() {
    if (animId) return;
    animId = requestAnimationFrame(tick);
  }

  function pause() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  /* ── events ── */
  var resizeRaf;

  window.addEventListener('resize', function () {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(function () {
      resizeRaf = null;
      resizeCanvas();
      syncParticleCount();
    });
  });

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  }

  document.addEventListener('visibilitychange', function () {
    document.hidden ? pause() : play();
  });

  /* ── init ── */
  createCanvas();
  resizeCanvas();
  syncParticleCount();
  play();
})();
