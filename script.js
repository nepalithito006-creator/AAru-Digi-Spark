// Aaru Digi Spark — site script

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header scrolled state
  const header = document.getElementById('main-header');
  if (header) {
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // Highlight current page in the nav
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  // Animated stat counters
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const runCounter = (el) => {
      const target = el.getAttribute('data-count');
      const numericTarget = parseInt(target, 10);
      if (isNaN(numericTarget)) return;
      const suffix = target.replace(String(numericTarget), '');
      const duration = 900;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(numericTarget * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runCounter(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // Animated skill bars
  const skillBars = document.querySelectorAll('.skill-fill');
  if (skillBars.length) {
    const skillObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-level') + '%';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  // ---- Starfield atmosphere: stars, shooting stars, drifting planets ----
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, stars, bursts = [], shootingStars = [];
    const STAR_COUNT_DENSITY = 0.00012;

    const PLANETS = [
      { name: 'earth', baseXPct: 0.86, baseYPct: 0.16, r: 68, parallax: 0.06, colors: ['#5fa8e0', '#1c3f66', '#081420'] },
      { name: 'mars',  baseXPct: 0.10, baseYPct: 0.78, r: 46, parallax: 0.1,  colors: ['#e0783f', '#8a3417', '#2a0f06'] }
    ];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.round(w * h * STAR_COUNT_DENSITY);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        parallax: Math.random() * 0.15 + 0.03
      }));
    }
    resize();
    window.addEventListener('resize', resize);

    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    document.addEventListener('click', (e) => {
      const count = 10;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = Math.random() * 2.2 + 1;
        bursts.push({ x: e.clientX, y: e.clientY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, r: Math.random() * 1.5 + 1 });
      }
    });

    function spawnShootingStar() {
      const fromTop = Math.random() < 0.6;
      const startX = fromTop ? Math.random() * w : -20;
      const startY = fromTop ? -20 : Math.random() * h * 0.5;
      const speed = Math.random() * 6 + 8;
      const angle = (Math.PI / 4) + (Math.random() * 0.3 - 0.15); // ~45deg down-right
      shootingStars.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 1, len: Math.random() * 60 + 60
      });
    }

    function drawPlanet(p, t) {
      const x = p.baseXPct * w + Math.sin(t * 0.0006 + p.r) * 14;
      const y = p.baseYPct * h + scrollY * p.parallax + Math.cos(t * 0.0005 + p.r) * 10;
      const grad = ctx.createRadialGradient(x - p.r * 0.35, y - p.r * 0.35, p.r * 0.1, x, y, p.r);
      grad.addColorStop(0, p.colors[0]);
      grad.addColorStop(0.55, p.colors[1]);
      grad.addColorStop(1, p.colors[2]);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = p.colors[0];
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.restore();
      return { x, y };
    }

    let t = 0;
    function draw() {
      t += 16;
      ctx.clearRect(0, 0, w, h);

      // planets (drawn first, furthest back)
      PLANETS.forEach(p => drawPlanet(p, t));

      // twinkling stars with scroll parallax
      stars.forEach(s => {
        const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
        const y = (s.y + scrollY * s.parallax) % h;
        ctx.beginPath();
        ctx.arc(s.x, y < 0 ? y + h : y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(alpha, 0.05)})`;
        ctx.fill();
      });

      // occasionally spawn a shooting star
      if (Math.random() < 0.01 && shootingStars.length < 3) spawnShootingStar();

      shootingStars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.012;
        const tailX = s.x - Math.cos(Math.atan2(s.vy, s.vx)) * s.len;
        const tailY = s.y - Math.sin(Math.atan2(s.vy, s.vx)) * s.len;
        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${Math.max(s.life, 0)})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      });
      shootingStars = shootingStars.filter(s => s.life > 0 && s.x < w + 100 && s.y < h + 100);

      // click bursts
      bursts.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
        b.life -= 0.02;
        if (b.life > 0) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r * b.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${b.life})`;
          ctx.fill();
        }
      });
      bursts = bursts.filter(b => b.life > 0);

      requestAnimationFrame(draw);
    }

    if (!reduceMotion) {
      draw();
    } else {
      PLANETS.forEach(p => drawPlanet(p, 0));
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.baseAlpha})`;
        ctx.fill();
      });
    }
  }

  if (reduceMotion) return;

  // Scroll-driven word reveal for the quote section
  const quoteWords = document.querySelectorAll('.quote-text .word');
  if (quoteWords.length) {
    const total = quoteWords.length;
    const updateWords = () => {
      const container = document.querySelector('.quote-text');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      // overall progress across the container's transit through the viewport
      const overall = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
      quoteWords.forEach((word, i) => {
        const start = i / total;
        const end = (i + 1) / total;
        let local = (overall - start) / (end - start);
        local = Math.min(Math.max(local, 0), 1);
        const lightness = 30 + local * 70; // 30% -> 100%
        word.style.color = `hsl(0 0% ${lightness}%)`;
      });
    };
    window.addEventListener('scroll', () => requestAnimationFrame(updateWords), { passive: true });
    updateWords();
  }
});
