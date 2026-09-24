/* ============================================================
   Portfolio — Abdelilah Elghazouani
   Interactions & animations (vanilla JS, no dependencies)
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollProgress();
  initScrollReveal();
  initTypingAnimation();
  initCounterAnimation();
  initActiveNavHighlight();
  initMobileMenu();
  initCursorGlow();
  initMagnetic();
  initCardTilt();
  initProjectSpotlight();
  if (!prefersReducedMotion) initEnergyCanvas();
});

/* ---------- Navbar scroll state ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let ticking = false;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100).toFixed(2) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // subtle stagger for siblings entering together
        const delay = Math.min(i * 60, 240);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ---------- Typing animation ---------- */
function initTypingAnimation() {
  const el = document.getElementById('typing');
  if (!el) return;
  const phrases = [
    'Audit énergétique',
    'CVC & Thermique',
    'ENR / Solaire PV',
    'DPE & Décret Tertiaire',
    'CEE · kWh cumac',
  ];
  if (prefersReducedMotion) { el.textContent = phrases[0]; return; }

  let p = 0, c = 0, deleting = false;
  const tick = () => {
    const word = phrases[p];
    el.textContent = word.substring(0, c);
    let speed = deleting ? 40 : 80;
    if (!deleting && c === word.length) { speed = 1800; deleting = true; }
    else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; speed = 350; }
    else { c += deleting ? -1 : 1; }
    setTimeout(tick, speed);
  };
  setTimeout(tick, 900);
}

/* ---------- Counter animation ---------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const statsSection = document.querySelector('.stats-section');
  if (!counters.length || !statsSection) return;

  let done = false;
  const run = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      if (prefersReducedMotion) { counter.textContent = target + suffix; return; }
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(eased * target) + (progress === 1 ? suffix : '');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !done) { done = true; run(); observer.disconnect(); }
    });
  }, { threshold: 0.35 });
  observer.observe(statsSection);
}

/* ---------- Active nav highlight ---------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.15, rootMargin: '-80px 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
}

/* ---------- Mobile menu auto-close ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  if (!toggle) return;
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => { toggle.checked = false; });
  });
}

/* ---------- Cursor glow (desktop, fine pointer) ---------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || prefersReducedMotion) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    glow.style.opacity = '1';
  });
  const loop = () => {
    cx += (x - cx) * 0.12;
    cy += (y - cy) * 0.12;
    glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = 0.3;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ---------- Card 3D tilt ---------- */
function initCardTilt() {
  if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const max = 7;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * max;
      const ry = (px - 0.5) * max;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------- Project spotlight (mouse-follow glow) ---------- */
function initProjectSpotlight() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- Energy field canvas (hero) ---------- */
function initEnergyCanvas() {
  const canvas = document.getElementById('energyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, particles, raf;
  const mouse = { x: -9999, y: -9999 };

  const AMBER = 'rgba(255, 179, 71,';
  const TEAL  = 'rgba(69, 214, 197,';

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    const density = Math.min(Math.max((w * h) / 16000, 40), 110);
    particles = [];
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        teal: Math.random() > 0.72,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const linkDist = 130;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // mouse repulsion
      const dxm = p.x - mouse.x, dym = p.y - mouse.y;
      const dm2 = dxm * dxm + dym * dym;
      if (dm2 < 14000) {
        const f = (14000 - dm2) / 14000;
        const d = Math.sqrt(dm2) || 1;
        p.x += (dxm / d) * f * 2.2;
        p.y += (dym / d) * f * 2.2;
      }

      const base = p.teal ? TEAL : AMBER;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = base + '0.85)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          const alpha = (1 - dist / linkDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = (p.teal || q.teal ? TEAL : AMBER) + alpha + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  window.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  // pause when hero off-screen
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0 }).observe(hero);
  }

  resize();
  raf = requestAnimationFrame(draw);
}
