// Aaru Digi Spark — site script

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // ---- Starfield atmosphere ----
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, stars, bursts = [];
    const STAR_COUNT_DENSITY = 0.00012; // stars per px^2

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
      // don't spawn a burst on interactive elements' normal click flow being obstructed —
      // canvas has pointer-events:none, so this listens globally and just adds visual flair
      const count = 10;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = Math.random() * 2.2 + 1;
        bursts.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          r: Math.random() * 1.5 + 1
        });
      }
    });

    let t = 0;
    function draw() {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      // twinkling stars, drifting slowly with scroll parallax
      stars.forEach(s => {
        const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
        const y = (s.y + scrollY * s.parallax) % h;
        ctx.beginPath();
        ctx.arc(s.x, y < 0 ? y + h : y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(alpha, 0.05)})`;
        ctx.fill();
      });

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
      // static, non-animated starfield for reduced-motion users
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.baseAlpha})`;
        ctx.fill();
      });
    }
  }

  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && reduceMotion) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  }

  if (reduceMotion) return;

  // Hero visual parallax on scroll (mirrors the Framer Motion useScroll transform)
  const heroVisual = document.querySelector('.hero-visual');
  const parallaxLayer = heroVisual ? heroVisual.querySelector('.parallax-layer') : null;
  if (heroVisual && parallaxLayer) {
    const updateParallax = () => {
      const rect = heroVisual.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when top of section at top of viewport, 1 when scrolled a full section height past
      const progress = Math.min(Math.max((0 - rect.top) / (rect.height || vh), 0), 1);
      const translateY = progress * -80; // px of parallax drift
      parallaxLayer.style.transform = `translateY(${translateY}px)`;
    };
    window.addEventListener('scroll', () => requestAnimationFrame(updateParallax), { passive: true });
    updateParallax();
  }

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
