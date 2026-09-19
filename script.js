// Aaru Digi Spark — site script (2050 command-center build)

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Nav: current page highlight + mobile menu ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // ---- Floating WhatsApp button (injected globally, no per-page markup needed) ----
  const WHATSAPP_NUMBER = '9779745347914'; // Nepal country code (977) + number provided
  if (!document.getElementById('whatsapp-float')) {
    const wa = document.createElement('a');
    wa.id = 'whatsapp-float';
    wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Aaru, I'd like to talk about a project.")}`;
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.4 1.32-1.93 1.4-.49.08-1.11.12-1.79-.11-.41-.14-.94-.31-1.62-.61-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.55-1.16-2.96 0-1.4.73-2.09 1-2.38.26-.28.57-.35.76-.35h.55c.18 0 .41-.03.64.49.24.55.81 1.9.88 2.04.07.14.11.3.02.49-.09.19-.14.3-.28.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.28.36-.23.6-.14.24.09 1.54.73 1.81.86.27.14.44.2.51.32.07.11.07.65-.17 1.33Z"/></svg>';
    document.body.appendChild(wa);
  }

  // ---- 3D scroll-reveal for cards, timeline steps, skill rows, pulse items ----
  const revealSelectors = '.service-card, .p-card, .card, .timeline .step, .skill-row, .cta-banner';
  document.querySelectorAll(revealSelectors).forEach(el => el.classList.add('reveal-3d'));
  const revealTargets = document.querySelectorAll('.reveal-3d');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), i % 6 * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => revealObserver.observe(el));
  }
  if (reduceMotion) {
    document.querySelectorAll('.reveal-3d').forEach(el => el.classList.add('in-view'));
  }

  // ---- Animated stat counters ----
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

  // ---- Animated skill bars ----
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

  if (reduceMotion) return;

  // ---- Scroll-driven word reveal for the quote section ----
  const quoteWords = document.querySelectorAll('.quote-text .word');
  if (quoteWords.length) {
    const total = quoteWords.length;
    const updateWords = () => {
      const container = document.querySelector('.quote-text');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const overall = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
      quoteWords.forEach((word, i) => {
        const start = i / total;
        const end = (i + 1) / total;
        let local = (overall - start) / (end - start);
        local = Math.min(Math.max(local, 0), 1);
        word.style.color = local > 0.5 ? 'var(--cyan)' : `hsl(220 25% ${18 + local * 40}%)`;
      });
    };
    window.addEventListener('scroll', () => requestAnimationFrame(updateWords), { passive: true });
    updateWords();
  }

  // ---- Data-network particle background ----
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes, pulses = [];
    const NODE_DENSITY = 0.00007;
    const LINK_DIST = 140;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(Math.round(w * h * NODE_DENSITY), 90);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 1
      }));
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('click', (e) => {
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.6;
        pulses.push({ x: e.clientX, y: e.clientY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 });
      }
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(0,255,240,${0.12 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,255,240,0.55)';
        ctx.fill();
      });

      pulses.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,45,149,${p.life})`;
          ctx.fill();
        }
      });
      pulses = pulses.filter(p => p.life > 0);

      requestAnimationFrame(draw);
    }
    draw();
  }
});
